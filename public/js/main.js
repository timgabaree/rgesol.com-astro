'use strict';

/*
|--------------------------------------------------------------------------
| RGE Solutions Shared JavaScript
|--------------------------------------------------------------------------
|
| Handles shared interactive behavior used across public pages.
|
*/

document.addEventListener('DOMContentLoaded', () => {
  const navigationToggle =
    document.querySelector('.site-nav-toggle');

  const primaryNavigation =
    document.getElementById('primary-navigation');

  if (
    !(navigationToggle instanceof HTMLButtonElement) ||
    !(primaryNavigation instanceof HTMLElement)
  ) {
    return;
  }

  const navigationLinks =
    primaryNavigation.querySelectorAll('a');

  const desktopBreakpoint =
    window.matchMedia('(min-width: 921px)');

  /**
   * Return whether the mobile navigation is open.
   */
  const navigationIsOpen = () =>
    navigationToggle.getAttribute('aria-expanded') === 'true';

  /**
   * Open or close the mobile navigation.
   */
  const setNavigationState = (isOpen) => {
    navigationToggle.setAttribute(
      'aria-expanded',
      isOpen ? 'true' : 'false'
    );

    primaryNavigation.classList.toggle(
      'is-open',
      isOpen
    );

    document.body.classList.toggle(
      'navigation-open',
      isOpen
    );
  };

  /**
   * Close the mobile navigation.
   */
  const closeNavigation = () => {
    setNavigationState(false);
  };

  /**
   * Toggle the mobile navigation.
   */
  navigationToggle.addEventListener('click', () => {
    setNavigationState(
      !navigationIsOpen()
    );
  });

  /**
   * Close the navigation after a link is selected.
   */
  navigationLinks.forEach((navigationLink) => {
    navigationLink.addEventListener(
      'click',
      closeNavigation
    );
  });

  /**
   * Close the navigation when Escape is pressed.
   */
  document.addEventListener('keydown', (event) => {
    if (
      event.key === 'Escape' &&
      navigationIsOpen()
    ) {
      closeNavigation();
      navigationToggle.focus();
    }
  });

  /**
   * Close the navigation when clicking outside the header.
   */
  document.addEventListener('click', (event) => {
    if (
      !navigationIsOpen() ||
      !(event.target instanceof Node)
    ) {
      return;
    }

    const siteHeader =
      navigationToggle.closest('.site-header');

    if (
      siteHeader instanceof HTMLElement &&
      !siteHeader.contains(event.target)
    ) {
      closeNavigation();
    }
  });

  /**
   * Reset mobile-only state when returning to desktop.
   */
  const handleViewportChange = (event) => {
    if (event.matches) {
      closeNavigation();
    }
  };

  desktopBreakpoint.addEventListener('change', handleViewportChange);
});
