describe('File Explorer E2E with Cypress', () => {
    it('loads the page and interacts with the folder tree', () => {
      // 1. Visit the page
      cy.visit('/');
  
      // 2. Assert the title is correct
      cy.get('h1').should('contain.text', 'File Explorer');
  
      // 3. Assert the initial folder tree is visible (from backend)
      // Using a longer timeout to wait for the API call
      cy.contains('Documents', { timeout: 15000 }).should('be.visible');
      cy.contains('Pictures').should('be.visible');
  
      // 4. Act: Click on the 'Documents' folder
      cy.contains('Documents').click();
  
      // 5. Assert: The right panel now shows the content
      cy.contains('.w-2\\/3', 'Work').should('be.visible');
      cy.contains('.w-2\\/3', 'Personal').should('be.visible');
  
      // 6. Act: Expand the 'Work' sub-folder
      cy.contains('.w-1\\/3', 'Work').should('be.visible').click();
  
    });
  });
  