#!/bin/sh

RESULTS_DIR="allure-results"
REPORT_DIR="allure-report"

# CDP's report viewer looks for index.html inside the published directory, so
# the report must always have one, even when Allure could not generate it.
write_fallback_report_html() {
  mkdir -p "$REPORT_DIR"
  cat > "$REPORT_DIR/index.html" <<EOF
<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><title>Test report unavailable</title></head>
<body>
<h1>Test report unavailable</h1>
<p>The Allure report could not be generated. See the run logs for details.</p>
</body>
</html>
EOF
}

echo "run_id: $RUN_ID"

# importer, inspector or all (default). Each team's suite is the tests/<domain>/ folder.
TEST_SUITE=$(echo "${TEST_SUITE:-all}" | tr '[:upper:]' '[:lower:]')
case "$TEST_SUITE" in
  all) TEST_PATH="tests/" ;;
  importer | inspector) TEST_PATH="tests/$TEST_SUITE/" ;;
  *) TEST_PATH="" ;;
esac
echo "test suite: $TEST_SUITE"

# Stale results or a stale FAILED marker must never affect this run
rm -rf test-results playwright-report "$RESULTS_DIR" "$REPORT_DIR" FAILED

# The FAILED reporter records test failures. A non-zero exit from anything else
# (crash, config error, no tests found) is recorded here too, so a run that
# dies before finishing can never report a pass.
if [ -z "$TEST_PATH" ]; then
  echo "unknown TEST_SUITE '$TEST_SUITE' (expected importer, inspector or all)" >> FAILED
else
  npx playwright test "$TEST_PATH" || echo "playwright test exited $? before completing" >> FAILED
fi

# Belt and braces: a "successful" run that recorded no results is a failure
result_count=$(find "$RESULTS_DIR" -name '*-result.json' 2>/dev/null | wc -l)
if [ "$result_count" -eq 0 ]; then
  echo "no test results were recorded in $RESULTS_DIR" >> FAILED
fi

if ! npm run report; then
  echo "allure report generation failed" >> FAILED
fi

if [ ! -f "$REPORT_DIR/index.html" ]; then
  write_fallback_report_html
fi

./bin/publish-tests.sh
publish_exit_code=$?

if [ $publish_exit_code -ne 0 ]; then
  echo "failed to publish test results"
  exit $publish_exit_code
fi

# At the end of the test run, if the suite has failed we write a file called 'FAILED'
if [ -f FAILED ]; then
  echo "test suite failed"
  cat ./FAILED
  exit 1
fi

echo "test suite passed"
exit 0
