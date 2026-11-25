@importer
Feature: Transport details page

  # Runs before every scenario: opens the test sign-in page and signs in as the default
  # test user. Scenarios that need a different user sign in again as that user
  
  Background:
    Given I am signed in as "North Quay Importer"

  # Signs in again as <user>, replacing the Background user, then completes the flow once per user
  Scenario Outline: Each test user can select a transport method, save and move on
    Given I am signed in as "<user>"
    And I start a new import
    When I select the transport method "<method>" and save and continue
    Then I am on the consignment arrival details page

    Examples:
      | user                     | method         |
      | North Quay Importer      | Ship or vessel |
      | Westhaven Importer       | Air freight    |
      | Harbourgate Import Agent | Road vehicle   |

  Scenario: Saving without a transport method shows an error
    Given I start a new import
    When I save and continue without selecting a transport method
    Then I am on the transport details page
    And the error summary says "Select how the consignment is being transported"
    And the field error says "Select how the consignment is being transported"

  # Only the key part of the wording is checked because the text is provisional until content review
  Scenario: The page explains that transport details come from the uploaded documents
    Given I start a new import
    Then the page explains "documents you upload"

  # Radio buttons: choosing a second option replaces the first
  Scenario: Only one transport method can be selected at a time
    Given I start a new import
    When I select the transport method "Ship or vessel"
    And I select the transport method "Air freight"
    Then only the transport method "Air freight" is selected

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

  # Goes to the guidance page directly instead of via the home page, then clicks Start now
  Scenario: Start now from the guidance page always creates a new draft
    Given I start a new import
    And I select the transport method "Road vehicle" and save and continue
    When I open the guidance page
    And I click Start now
    Then no transport method is selected

  # Clearing cookies removes the session, so signing in again is required
  Scenario: Clearing cookies starts a new draft
    Given I start a new import
    And I select the transport method "Road vehicle" and save and continue
    When I clear my cookies
    And I am signed in as "North Quay Importer"
    And I start another new import
    Then no transport method is selected

  Scenario: After clearing cookies, reopening transport details does not show the old draft
    Given I start a new import
    And I select the transport method "Road vehicle" and save and continue
    When I clear my cookies
    And I am signed in as "North Quay Importer"
    And I reopen the transport details page
    Then no transport method is selected

  # Going straight to the URL (not through Start now) is what picks up the existing draft
  Scenario: Signing out and back in as the same user keeps the draft, and changes update it
    Given I start a new import
    And I select the transport method "Ship or vessel" and save and continue
    When I sign out
    And I am signed in as "North Quay Importer"
    And I reopen the transport details page
    Then the transport method "Ship or vessel" is selected
    When I select the transport method "Road vehicle" and save and continue
    And I reopen the transport details page
    Then the transport method "Road vehicle" is selected

  Scenario: A different user signing in does not see the previous user's draft
    Given I start a new import
    And I select the transport method "Ship or vessel" and save and continue
    When I sign out
    And I am signed in as "Westhaven Importer"
    And I reopen the transport details page
    Then no transport method is selected

  # Pressing Start now after signing back in starts a new draft instead of reusing the old one
  Scenario: Start now after signing back in creates a new draft
    Given I start a new import
    And I select the transport method "Ship or vessel" and save and continue
    When I sign out
    And I am signed in as "North Quay Importer"
    And I open the guidance page
    And I click Start now
    Then no transport method is selected
  
  # Tab 1 is the test's main tab. "In another tab" steps use tab 2, opened in the same browser session
  # Steps without a tab mentioned (such as reopening the page) always use tab 1
  # Going straight to the URL in tab 1 shows the draft tab 2 saved, not the one tab 1 saved
  Scenario: Starting a new import in another tab makes the first tab use the current draft
    Given I start a new import
    And I select the transport method "Ship or vessel" and save and continue
    When I start a new import in another tab
    And I select the transport method "Air freight" and save and continue in the other tab
    And I reopen the transport details page
    Then the transport method "Air freight" is selected
