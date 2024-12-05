/// <reference types="Cypress" />

describe("Check for broken links on google.com", () => {
  it("Should find and report broken links.", () => {
    // Open google.com
    cy.visit("https://www.google.com");

    // Get all <a> elements (links) on the page
    cy.get("a").each(($el) => {
      // Get the href (URL) attribute of each <a> element
      cy.wrap($el)
        .invoke("attr", "href")
        .then((href) => {
          // Check if the link is not empty and starts with "http" (filtering out mailto, javascript links, etc.)
          if (href && href.startsWith("http")) {
            // Make an HTTP request to check the link status
            cy.request({
              url: href,
              failOnStatusCode: false, // Prevent Cypress from failing the test on 4xx or 5xx status codes
            }).then((response) => {
              // Check if the status code is 4xx or 5xx, which means the link is broken
              if (response.status >= 400) {
                console.log(
                  `Broken link: ${href} - Status Code: ${response.status}`
                );
              } else {
                console.log(
                  `Valid link: ${href} - Status Code: ${response.status}`
                );
              }
            });
          }
        });
    });
  });
});
