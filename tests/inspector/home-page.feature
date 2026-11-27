@inspector
Feature: Inspector home page

  # Only the URL is checked until the inspector service has content to assert on
  Scenario: Inspector home page opens
    Given I am on the inspector home page
    Then the inspector home page URL is shown
