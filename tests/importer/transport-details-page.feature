@importer
Feature: Transport details page

  Background:
    Given I am signed in as "North Quay Importer"

  # Only the URL is checked while the transport details page is still being built
  Scenario: Transport details page opens
    Given I start a new import
    Then I am on the transport details page

  Scenario Outline: Selecting a transport method saves it and moves on
    Given I start a new import
    When I select the transport method "<method>" and save and continue
    Then I am on the consignment arrival details page

    Examples:
      | method         |
      | Ship or vessel |
      | Air freight    |
      | Road vehicle   |

  Scenario: A saved transport method is still selected when the page is reopened
    Given I start a new import
    When I select the transport method "Air freight" and save and continue
    And I reopen the transport details page
    Then the transport method "Air freight" is selected

  # A new import must be a new draft, so nothing carries over from the previous one
  Scenario: Starting another new import does not reuse the previous transport method
    Given I start a new import
    And I select the transport method "Ship or vessel" and save and continue
    When I start another new import
    Then no transport method is selected

  Scenario: Saving without a transport method shows an error
    Given I start a new import
    When I save and continue without selecting a transport method
    Then I am on the transport details page
    And the error summary says "Select how the consignment is being transported"
