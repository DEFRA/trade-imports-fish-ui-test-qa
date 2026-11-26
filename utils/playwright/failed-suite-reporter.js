import fs from 'node:fs'

const FAILED_FILE = 'FAILED'

/**
 * Writes the FAILED marker the CDP test-suite entrypoint reads. A test counts
 * as failed only when its final outcome is unexpected; a test that failed and
 * then passed on retry is flaky and does not fail the suite.
 */
class FailedSuiteReporter {
  outcomes = new Map()
  retries = 0

  onTestEnd(test, result) {
    if (result.retry > 0) {
      this.retries += 1
    }
    this.outcomes.set(test, test.outcome())
  }

  onEnd(result) {
    const summary = {
      finished: 0,
      passed: 0,
      flaky: 0,
      retries: this.retries,
      failed: 0
    }

    for (const outcome of this.outcomes.values()) {
      if (outcome === 'skipped') continue
      summary.finished += 1
      if (outcome === 'expected') {
        summary.passed += 1
      } else if (outcome === 'flaky') {
        summary.flaky += 1
      } else {
        summary.failed += 1
      }
    }

    if (summary.failed > 0 || result.status === 'failed') {
      fs.writeFileSync(FAILED_FILE, JSON.stringify(summary))
    } else if (fs.existsSync(FAILED_FILE)) {
      fs.rmSync(FAILED_FILE)
    }
  }
}

export default FailedSuiteReporter
