document.addEventListener('DOMContentLoaded', function () {

  // ========================================
  // CONTACT FORM ELEMENTS
  // ========================================

  const letsConnectBtn =
    document.getElementById('letsConnectBtn');

  const contactForm =
    document.getElementById('contactForm');

  const contactFormSendus =
    document.getElementById('contactFormSendus');

  const overlay =
    document.getElementById('overlay');

  const thankYouMessage =
    document.getElementById('thankYouMessage');

  const thankYouClose =
    document.getElementById('thankYouClose');


  // ========================================
  // IMPORTANT
  // If this page doesn't contain the contact
  // form, simply stop this script.
  // ========================================

  if (!contactFormSendus) {
    console.warn(
      'Lets Connect: #contactFormSendus was not found on this page.'
    );

    return;
  }


  // ========================================
  // SUBMIT BUTTON
  // ========================================

  const submitBtn =
    contactFormSendus.querySelector(
      'button[type="submit"]'
    );

  if (!submitBtn) {
    console.warn(
      'Lets Connect: Submit button was not found.'
    );

    return;
  }


  // ========================================
  // FORM STATE
  // ========================================

  let isFormHovered = false;
  let isFormFocused = false;
  let isSubmitting = false;


  // ========================================
  // OPEN FORM
  // ========================================

  function openForm() {

    if (contactForm) {
      contactForm.classList.add('active');
    }

    if (overlay) {
      overlay.classList.add('active');
    }
  }


  // ========================================
  // CLOSE FORM
  // ========================================

  function closeFormPanel() {

    // Don't close while:
    // - hovering
    // - focused
    // - submitting

    if (
      isFormHovered ||
      isFormFocused ||
      isSubmitting
    ) {
      return;
    }

    if (contactForm) {
      contactForm.classList.remove('active');
    }

    if (overlay) {
      overlay.classList.remove('active');
    }
  }


  // ========================================
  // LET'S CONNECT BUTTON
  // ========================================

  if (letsConnectBtn) {

    letsConnectBtn.addEventListener(
      'click',
      function (event) {

        event.preventDefault();

        openForm();
      }
    );

  }


  // ========================================
  // MOUSE HOVER
  // ========================================

  if (contactForm) {

    contactForm.addEventListener(
      'mouseenter',
      function () {

        isFormHovered = true;

      }
    );


    contactForm.addEventListener(
      'mouseleave',
      function () {

        isFormHovered = false;

        closeFormPanel();

      }
    );


    // ========================================
    // FORM FOCUS
    // ========================================

    contactForm.addEventListener(
      'focusin',
      function () {

        isFormFocused = true;

      }
    );


    contactForm.addEventListener(
      'focusout',
      function () {

        setTimeout(function () {

          isFormFocused =
            contactForm.contains(
              document.activeElement
            );

          closeFormPanel();

        }, 0);

      }
    );

  }


  // ========================================
  // FORM VALIDATION
  // ========================================

  const fields =
    contactFormSendus.querySelectorAll(
      'input[required], textarea[required]'
    );


  function validateField(field) {

    const group =
      field.closest('.form-group');

    const value =
      field.value.trim();

    let valid = value !== '';


    // Email validation
    if (
      field.type === 'email' &&
      valid
    ) {

      valid =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
          value
        );

    }


    if (group) {

      group.classList.toggle(
        'invalid',
        !valid
      );

      group.classList.toggle(
        'valid',
        valid
      );

    }


    return valid;
  }


  function validateForm() {

    let isValid = true;

    fields.forEach(function (field) {

      if (!validateField(field)) {
        isValid = false;
      }

    });

    return isValid;
  }


  // ========================================
  // BUTTON HELPERS
  // ========================================

  const originalButtonHTML =
    'SEND MESSAGE';


  function showSubmittingButton() {

    submitBtn.disabled = true;

    submitBtn.innerHTML = `
      <i class="bi bi-geo submit-icon"></i>
      SUBMITTING...
    `;

  }


  function showSubmittedButton() {

    submitBtn.disabled = true;

    submitBtn.innerHTML = `
      <i class="bi bi-check-circle"></i>
      SUBMITTED
    `;

  }


  function showSendingButton() {

    submitBtn.disabled = true;

    submitBtn.innerHTML =
      'SENDING...';

  }


  function showTryAgainButton() {

    submitBtn.disabled = false;

    submitBtn.innerHTML = `
      <i class="bi bi-arrow-repeat rotating-icon"></i>
      TRY AGAIN
    `;

  }


  function resetSubmitButton() {

    submitBtn.disabled = false;

    submitBtn.innerHTML =
      originalButtonHTML;

  }


  // ========================================
  // VALIDATE WHILE TYPING
  // ========================================

  fields.forEach(function (field) {

    field.addEventListener(
      'input',
      function () {

        validateField(field);

        if (validateForm()) {
          resetSubmitButton();
        }

      }
    );


    field.addEventListener(
      'blur',
      function () {

        validateField(field);

      }
    );

  });


  // ========================================
  // FORM SUBMISSION
  // ========================================

  contactFormSendus.addEventListener(
    'submit',
    async function (event) {

      event.preventDefault();

      if (isSubmitting) {
        return;
      }


      // ====================================
      // VALIDATION
      // ====================================

      if (!validateForm()) {

        showTryAgainButton();

        return;
      }


      // ====================================
      // START SUBMISSION
      // ====================================

      isSubmitting = true;

      openForm();

      showSubmittingButton();


      // ====================================
      // COLLECT FORM DATA
      // ====================================

      const formData = {

        fullName:
          contactFormSendus.fullName
            ? contactFormSendus.fullName.value
            : '',

        email:
          contactFormSendus.email
            ? contactFormSendus.email.value
            : '',

        phone:
          contactFormSendus.phone
            ? contactFormSendus.phone.value
            : '',

        company:
          contactFormSendus.company
            ? contactFormSendus.company.value
            : '',

        service:
          contactFormSendus.service
            ? contactFormSendus.service.value
            : '',

        challenge:
          contactFormSendus.challenge
            ? contactFormSendus.challenge.value
            : ''

      };


      try {

        // ==================================
        // GOOGLE SHEETS SUBMISSION
        // ==================================

        await fetch(
          'https://script.google.com/macros/s/AKfycbxyGkW-dyqBVuchFl_Cn4XDqIlDUxryT9AbfA9VRQ5021gemIHasZVCmwZv6NzzyrIH/exec',
          {
            method: 'POST',
            mode: 'no-cors',
            body: JSON.stringify(formData)
          }
        );


        // ==================================
        // SUCCESS
        // ==================================

        showSubmittedButton();


        // Hide form
        contactFormSendus.classList.add(
          'submitted'
        );


        // Show thank you message
        if (thankYouMessage) {

          thankYouMessage.classList.add(
            'active'
          );

          thankYouMessage.style.display =
            'block';

        }


        // Hide heading
        const formHeader =
          document.querySelector(
            '.form-header'
          );

        if (formHeader) {

          formHeader.style.display =
            'none';

        }


        // Hide form itself
        contactFormSendus.style.display =
          'none';


        // Reset fields AFTER submission
        contactFormSendus.reset();


      } catch (error) {

        console.error(
          'Form submission failed:',
          error
        );


        showTryAgainButton();


        alert(
          'Unable to submit your message. Please try again.'
        );

      } finally {

        isSubmitting = false;

      }

    }
  );


  // ========================================
  // THANK YOU - CLOSE / RESET
  // ========================================

  if (thankYouClose) {

    thankYouClose.addEventListener(
      'click',
      function () {


        // ----------------------------------
        // Hide thank you
        // ----------------------------------

        if (thankYouMessage) {

          thankYouMessage.classList.remove(
            'active'
          );

          thankYouMessage.style.removeProperty(
            'display'
          );

        }


        // ----------------------------------
        // Restore form
        // ----------------------------------

        contactFormSendus.classList.remove(
          'submitted'
        );

        contactFormSendus.style.removeProperty(
          'display'
        );


        // ----------------------------------
        // Restore heading
        // ----------------------------------

        const formHeader =
          document.querySelector(
            '.form-header'
          );

        if (formHeader) {

          formHeader.style.removeProperty(
            'display'
          );

        }


        // ----------------------------------
        // Reset form
        // ----------------------------------

        contactFormSendus.reset();


        // ----------------------------------
        // Reset validation classes
        // ----------------------------------

        fields.forEach(function (field) {

          const group =
            field.closest('.form-group');

          if (group) {

            group.classList.remove(
              'invalid',
              'valid'
            );

          }

        });


        // ----------------------------------
        // Reset button
        // ----------------------------------

        resetSubmitButton();


        // ----------------------------------
        // Reset states
        // ----------------------------------

        isFormFocused = false;
        isSubmitting = false;


        // ----------------------------------
        // Keep form open if mouse is inside
        // ----------------------------------

        if (isFormHovered) {

          if (contactForm) {
            contactForm.classList.add(
              'active'
            );
          }

          if (overlay) {
            overlay.classList.add(
              'active'
            );
          }

        } else {

          if (contactForm) {
            contactForm.classList.remove(
              'active'
            );
          }

          if (overlay) {
            overlay.classList.remove(
              'active'
            );
          }

        }

      }
    );

  }

});