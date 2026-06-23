package main

import (
	"fmt"
	"os"
	"os/exec"
	"strings"
	"time"
)

// ─────────────────────────────────────────────
//  Token counter (rough: 4 chars ≈ 1 token)
// ─────────────────────────────────────────────

func countTokens(s string) int {
	return len(s) / 4
}

// ─────────────────────────────────────────────
//  Runner – executes the real command
// ─────────────────────────────────────────────

type Result struct {
	Output   string
	ExitCode int
	Duration time.Duration
}

func runCommand(args []string) Result {
	start := time.Now()
	cmd := exec.Command(args[0], args[1:]...)

	// pass through real stdin so interactive commands still work
	cmd.Stdin = os.Stdin

	raw, err := cmd.CombinedOutput()
	duration := time.Since(start)

	exitCode := 0
	if err != nil {
		if exitErr, ok := err.(*exec.ExitError); ok {
			exitCode = exitErr.ExitCode()
		}
	}

	return Result{
		Output:   string(raw),
		ExitCode: exitCode,
		Duration: duration,
	}
}

// ─────────────────────────────────────────────
//  Filters
// ─────────────────────────────────────────────

// genericFilter: strips blank lines, truncates long output
func genericFilter(output string) string {
	lines := strings.Split(strings.TrimSpace(output), "\n")

	var clean []string
	for _, l := range lines {
		if strings.TrimSpace(l) != "" {
			clean = append(clean, l)
		}
	}

	maxLines := 40
	if len(clean) <= maxLines {
		return strings.Join(clean, "\n")
	}

	half := maxLines / 2
	skipped := len(clean) - maxLines
	result := append(clean[:half],
		fmt.Sprintf("  ... [%d lines hidden] ...", skipped))
	result = append(result, clean[len(clean)-half:]...)
	return strings.Join(result, "\n")
}

// mkdirFilter: mkdir is silent on success, just confirm
func mkdirFilter(args []string, output string) string {
	// strip the command name from args to get the dirs
	dirs := args[1:]
	if output == "" {
		return fmt.Sprintf("ok: created %s", strings.Join(dirs, ", "))
	}
	// if there's output it's usually an error — show it
	return strings.TrimSpace(output)
}

// lsFilter: remove extra whitespace, group count
func lsFilter(args []string, output string) string {
	lines := strings.Split(strings.TrimSpace(output), "\n")
	var clean []string
	for _, l := range lines {
		if strings.TrimSpace(l) != "" {
			clean = append(clean, l)
		}
	}
	header := fmt.Sprintf("[%d items]", len(clean))
	if len(clean) > 20 {
		result := []string{header}
		result = append(result, clean[:20]...)
		result = append(result, fmt.Sprintf("  ... [%d more] ...", len(clean)-20))
		return strings.Join(result, "\n")
	}
	return header + "\n" + strings.Join(clean, "\n")
}

// gitStatusFilter: strip hint lines, keep file changes
func gitStatusFilter(args []string, output string) string {
	var keep []string
	for _, line := range strings.Split(output, "\n") {
		trimmed := strings.TrimSpace(line)
		if trimmed == "" {
			continue
		}
		// drop git's "(use git add ...)" hint lines
		if strings.HasPrefix(trimmed, "(use ") {
			continue
		}
		keep = append(keep, line)
	}
	return strings.Join(keep, "\n")
}

// gitPushPullFilter: collapse verbose push/pull into one line
func gitPushPullFilter(args []string, output string) string {
	for _, line := range strings.Split(output, "\n") {
		if strings.Contains(line, "->") {
			parts := strings.Split(line, "->")
			branch := strings.TrimSpace(parts[len(parts)-1])
			return "ok " + branch
		}
	}
	if strings.Contains(output, "up to date") {
		return "ok (already up to date)"
	}
	return "ok"
}

// gitLogFilter: keep only the short summary lines
func gitLogFilter(args []string, output string) string {
	return genericFilter(output)
}

// echoFilter: echo is already minimal, pass through
func echoFilter(args []string, output string) string {
	return strings.TrimSpace(output)
}

// rmFilter: rm is silent on success
func rmFilter(args []string, output string) string {
	targets := args[1:]
	if output == "" {
		return fmt.Sprintf("ok: removed %s", strings.Join(targets, ", "))
	}
	return strings.TrimSpace(output)
}

// pwdFilter: already one line
func pwdFilter(args []string, output string) string {
	return strings.TrimSpace(output)
}

// catFilter: truncate large files
func catFilter(args []string, output string) string {
	return genericFilter(output)
}

// dockerPsFilter: keep only name + status + ports
func dockerPsFilter(args []string, output string) string {
	lines := strings.Split(strings.TrimSpace(output), "\n")
	var keep []string
	for _, line := range lines {
		if strings.TrimSpace(line) != "" {
			keep = append(keep, line)
		}
	}
	return strings.Join(keep, "\n")
}

// ─────────────────────────────────────────────
//  Filter Registry
// ─────────────────────────────────────────────

type FilterFunc func(args []string, output string) string

type Rule struct {
	Command string // e.g. "git"
	Sub     string // e.g. "status" — empty means match any subcommand
	Filter  FilterFunc
}

var registry = []Rule{
	// filesystem
	{"mkdir", "", mkdirFilter},
	{"ls", "", lsFilter},
	{"ll", "", lsFilter},
	{"rm", "", rmFilter},
	{"cat", "", catFilter},
	{"pwd", "", pwdFilter},
	{"echo", "", echoFilter},

	// git
	{"git", "status", gitStatusFilter},
	{"git", "push", gitPushPullFilter},
	{"git", "pull", gitPushPullFilter},
	{"git", "log", gitLogFilter},

	// docker
	{"docker", "ps", dockerPsFilter},
}

func findFilter(args []string) FilterFunc {
	if len(args) == 0 {
		return func(_ []string, o string) string { return o }
	}

	cmd := args[0]
	sub := ""
	if len(args) > 1 {
		sub = args[1]
	}

	for _, rule := range registry {
		if rule.Command != cmd {
			continue
		}
		// if rule has no Sub, it matches any subcommand
		if rule.Sub == "" || rule.Sub == sub {
			return rule.Filter
		}
	}

	// fallback
	return func(_ []string, o string) string { return genericFilter(o) }
}

// ─────────────────────────────────────────────
//  Main
// ─────────────────────────────────────────────

func main() {
	args := os.Args[1:]

	if len(args) == 0 {
		printHelp()
		os.Exit(0)
	}

	// built-in subcommands
	if args[0] == "help" || args[0] == "--help" || args[0] == "-h" {
		printHelp()
		os.Exit(0)
	}

	// ── run the real command ──
	result := runCommand(args)

	// ── find and apply filter ──
	filterFn := findFilter(args)
	filtered := filterFn(args, result.Output)

	// ── print savings banner ──
	rawTokens := countTokens(result.Output)
	filteredTokens := countTokens(filtered)
	savedPct := 0
	if rawTokens > 0 {
		savedPct = 100 - (filteredTokens*100)/rawTokens
	}

	// print the filtered output
	if filtered != "" {
		fmt.Println(filtered)
	}

	// print a small savings hint (goes to stderr so it doesn't pollute stdout)
	if rawTokens > 0 && savedPct > 0 {
		fmt.Fprintf(os.Stderr, "\n[myrtk] %d → %d tokens  (-%d%%  %.0fms)\n",
			rawTokens, filteredTokens, savedPct, float64(result.Duration.Milliseconds()))
	}

	// ── exit with the real exit code ──
	os.Exit(result.ExitCode)
}

func printHelp() {
	fmt.Println(`myrtk – CLI proxy that compresses command output for LLMs

Usage:
  myrtk <command> [args...]

Examples:
  myrtk mkdir foo bar       → "ok: created foo, bar"
  myrtk ls .                → compact directory listing
  myrtk git status          → noise-free git status
  myrtk git push            → "ok main"
  myrtk cat big_file.txt    → truncated file content

Supported commands:
  mkdir, ls, ll, rm, cat, pwd, echo
  git status, git push, git pull, git log
  docker ps

Any other command passes through with generic truncation.`)
}