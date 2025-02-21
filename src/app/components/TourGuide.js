import React, { useEffect } from 'react';
import Shepherd from 'shepherd.js';
import 'shepherd.js/dist/css/shepherd.css';

const TourGuide = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (!isOpen) return;

    const tour = new Shepherd.Tour({
      defaultStepOptions: {
        scrollTo: true,
        cancelIcon: {
          enabled: true
        },
        classes: 'shadow-md bg-purple-dark',
      },
      useModalOverlay: true, // Enable modal overlay

      modalOverlayOpeningPadding: 10,
    });

    tour.addStep({
      id: 'search',
      text: 'Use this to scrape professor data from ratemyprofessors.com. Correct format: https://www.ratemyprofessors.com/professor/n_digit_number',
      attachTo: {
        element: '.scrape',
        on: 'bottom'
      },
      buttons: [
        {
          text: 'Next',
          action: tour.next
        }
      ]
    });

    tour.addStep({
      id: 'chat-container',
      text: 'This is where all your conversations with the AI assistant will appear.',
      attachTo: {
        element: '.chat-container',
        on: 'center'
      },
      buttons: [
        {
          text: 'Back',
          action: tour.back
        },
        {
          text: 'Next',
          action: tour.next
        }
      ]
    });

    tour.addStep({
      id: 'chat-input',
      text: 'You can type your queries here to chat with the AI assistant and press Enter to send or click the Send button.',
      attachTo: {
        element: '.chat-input',
        on: 'top'
      },
      buttons: [
        {
          text: 'Back',
          action: tour.back
        },
        {
          text: 'Finish',
          action: tour.complete
        }
      ]
    });

    tour.start();

    // Cleanup on unmount
    return () => {
      tour.cancel();
    };
  }, [isOpen]);

  return null; // Shepherd.js handles UI rendering
};

export default TourGuide;