@importer
Feature: Transport details page

  Background:
    Given I am signed in as "North Quay Importer"

  # Only the URL is checked while the transport details page is still being built
  Scenario: Transport details page opens
    Given I open the transport details page
    Then I am on the transport details page
