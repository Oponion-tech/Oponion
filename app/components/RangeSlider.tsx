'use client';

import { useState, useEffect, useRef } from "react";
import styles from './RangeSlider.module.css';

// Type declarations for jQuery
declare global {
  interface Window {
    jQuery: any;
    $: any;
  }
}

interface RangeSliderProps {
  min: number;
  max: number;
  values: [number, number];
  onChange: (values: [number, number]) => void;
  label: string;
  unit?: string;
}

export default function RangeSlider({ 
  min, 
  max, 
  values, 
  onChange, 
  unit = "" 
}: RangeSliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [sliderInstance, setSliderInstance] = useState<any>(null);

  useEffect(() => {
    // Load jQuery and jQuery UI dynamically
    const loadJQuery = async () => {
      if (typeof window !== 'undefined' && !window.jQuery) {
        // Load jQuery
        const jqueryScript = document.createElement('script');
        jqueryScript.src = 'https://code.jquery.com/jquery-3.7.1.min.js';
        jqueryScript.onload = () => {
          // Load jQuery UI CSS
          const jqueryUICSS = document.createElement('link');
          jqueryUICSS.rel = 'stylesheet';
          jqueryUICSS.href = 'https://code.jquery.com/ui/1.14.1/themes/base/jquery-ui.css';
          document.head.appendChild(jqueryUICSS);
          
          // Load jQuery UI JS
          const jqueryUIScript = document.createElement('script');
          jqueryUIScript.src = 'https://code.jquery.com/ui/1.14.1/jquery-ui.js';
          jqueryUIScript.onload = () => {
            initializeSlider();
          };
          document.head.appendChild(jqueryUIScript);
        };
        document.head.appendChild(jqueryScript);
      } else if (window.jQuery && window.jQuery.ui) {
        initializeSlider();
      }
    };

    const initializeSlider = () => {
      if (sliderRef.current && window.jQuery && window.jQuery.ui) {
        const $ = window.jQuery;
        
        // Destroy existing slider if it exists
        if (sliderInstance) {
          sliderInstance.slider('destroy');
        }

        // Create new slider
        const newSlider = $(sliderRef.current).slider({
          range: true,
          min: min,
          max: max,
          values: values,
          slide: function(event: any, ui: any) {
            onChange([ui.values[0], ui.values[1]]);
          }
        });

        setSliderInstance(newSlider);
      }
    };

    loadJQuery();

    return () => {
      if (sliderInstance && window.jQuery) {
        sliderInstance.slider('destroy');
      }
    };
  }, [min, max]);

  // Update slider when values change externally
  useEffect(() => {
    if (sliderInstance && window.jQuery) {
      sliderInstance.slider('option', 'values', values);
    }
  }, [values, sliderInstance]);

  return (
    <div className={styles.rangeSliderSection}>
      <div className={styles.rangeSliderWrapper}>
        <div className={styles.rangeValues}>
          <span>{values[0]}{unit}</span>
          <span>{values[1]}{unit}</span>
        </div>
        <div ref={sliderRef} className={styles.jquerySlider}></div>
      </div>
    </div>
  );
}
