/**
 * @file When an element is in violation of an A11Y rule, it has a highlight button.
 *       Clicking the button runs this file's code to scroll to the element and put
 *       thick border around it. Clicking the button again removes the border.
 */

const HIGHLIGHTER_ID = 'vue-dev-tools-accessibility-highlighter';

/**
 * Hide the highlighter and reset it.
 */
export const clearHighlights = function () {
  if (!document.getElementById(HIGHLIGHTER_ID)) {
    return;
  }
  const highlighterElement = document.getElementById(HIGHLIGHTER_ID);
  highlighterElement.style.display = 'none';
  highlighterElement['data-target'] = '';
};

/**
 * Creates the highlighter element if it does not exist.
 */
const createHighlighterElement = function () {
  if (!document.getElementById(HIGHLIGHTER_ID)) {
    const newHighlighter = document.createElement('div');
    newHighlighter.id = HIGHLIGHTER_ID;
    document.body.appendChild(newHighlighter);
  }
};

/**
 * Highlights a DOM node on the page and scrolls to it.
 *
 * @param {object} win     The DevTools iframe window object
 * @param {string} target  The CSS selector to highlight
 */
export const highlightTarget = function (win, target) {
  createHighlighterElement();

  const highlighterElement = document.getElementById(HIGHLIGHTER_ID);
  const targetElement = document.querySelector(target);

  if (highlighterElement['data-target'] === target) {
    clearHighlights();
    return;
  }

  const bodyBox = document.body.getBoundingClientRect();
  const targetBox = targetElement.getBoundingClientRect();

  const top = targetBox.top - bodyBox.top;
  const left = targetBox.left - bodyBox.left;

  highlighterElement['data-target'] = target;
  highlighterElement.style = [
    'position: absolute',
    'top: ' + top + 'px',
    'left: ' + left + 'px',
    'display: block',
    'width: ' + targetBox.width + 'px',
    'height: ' + targetBox.height + 'px',
    'outline: 4px solid #F00'
  ].join(';');
  targetElement.scrollIntoView({
    behavior: 'smooth',
    block: 'center',
    inline: 'center'
  });
};
