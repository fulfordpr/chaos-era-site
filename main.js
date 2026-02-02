// CHAOS ERA - Main JavaScript
console.log('CHAOS ERA - Main JS Loaded');
// Set current year in footer
document.getElementById('year').textContent = new Date().getFullYear();

// Mobile menu toggle
const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');
menuToggle.addEventListener('click', () => {
  const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!expanded));
  mobileMenu.style.display = expanded ? 'none' : 'block';
});

// Mobile autoplay handling: leave control to browser; keep poster as fallback
const bgVideo = document.getElementById('bgVideo');
// Previously we paused video on small screens which hid the visual.
// Modern browsers will block autoplay if needed; keeping the element ensures
// poster/fallback is visible and users can tap to play on mobile.

// Product card modal - click to enlarge
document.addEventListener('click', function(e) {
  const productCard = e.target.closest('.product-item');

  // Don't trigger if clicking on buttons, inputs, or selects
  if (e.target.closest('button, input, select, .shopify-buy__btn, .shopify-buy__option-select-wrapper')) {
    return;
  }

  if (productCard) {
    // Store original position info
    const originalParent = productCard.parentNode;
    const originalNextSibling = productCard.nextSibling;
    const originalStyles = productCard.getAttribute('style') || '';

    // Create placeholder to maintain grid layout
    const placeholder = document.createElement('div');
    placeholder.style.cssText = `
      width: ${productCard.offsetWidth}px;
      height: ${productCard.offsetHeight}px;
    `;
    originalParent.insertBefore(placeholder, originalNextSibling);

    // Create overlay with blur background
    const overlay = document.createElement('div');
    overlay.className = 'product-modal-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.85);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      padding: 40px;
      box-sizing: border-box;
    `;

    // Create modal container (width of main container ~1200px)
    const modalContainer = document.createElement('div');
    modalContainer.style.cssText = `
      width: 100%;
      max-width: 1200px;
      max-height: 90vh;
      overflow-y: auto;
      position: relative;
    `;

    // Style the product card for modal display
    productCard.style.cssText = `
      width: 100%;
      max-width: 100%;
      background: rgba(20, 20, 20, 0.98);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 12px;
      padding: 2rem;
    `;

    // Create close button
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '✕';
    closeBtn.style.cssText = `
      position: absolute;
      top: -15px;
      right: -15px;
      background: rgba(255, 255, 255, 0.15);
      border: 1px solid rgba(255, 255, 255, 0.3);
      color: white;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      font-size: 20px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10001;
    `;
    closeBtn.onmouseover = () => closeBtn.style.background = 'rgba(255,255,255,0.25)';
    closeBtn.onmouseout = () => closeBtn.style.background = 'rgba(255,255,255,0.15)';

    // Move card into modal
    modalContainer.appendChild(productCard);
    modalContainer.appendChild(closeBtn);
    overlay.appendChild(modalContainer);
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    // Close function - restore card to original position
    function closeModal() {
      productCard.setAttribute('style', originalStyles);
      placeholder.replaceWith(productCard);
      overlay.remove();
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleEscape);
    }

    // Close on overlay click (not modal content)
    overlay.addEventListener('click', function(evt) {
      if (evt.target === overlay) {
        closeModal();
      }
    });

    // Close button click
    closeBtn.addEventListener('click', function(evt) {
      evt.stopPropagation();
      closeModal();
    });

    // Close on escape key
    function handleEscape(evt) {
      if (evt.key === 'Escape') {
        closeModal();
      }
    }
    document.addEventListener('keydown', handleEscape);
  }
});
