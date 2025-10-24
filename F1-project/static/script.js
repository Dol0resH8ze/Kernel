document.addEventListener("DOMContentLoaded", () => {
  const native = document.getElementById("raceSelect");
  if (!native) return;

  // build custom select wrapper
  const wrapper = document.createElement("div");
  wrapper.className = "custom-select";
  native.parentNode.insertBefore(wrapper, native);
  wrapper.appendChild(native); // move native inside wrapper
  native.classList.add("native-select");

  // Create trigger button
  const trigger = document.createElement("button");
  trigger.type = "button";
  trigger.className = "custom-select__trigger";
  trigger.setAttribute("aria-haspopup", "listbox");
  trigger.setAttribute("aria-expanded", "false");

  const label = document.createElement("span");
  label.className = "custom-select__label";
  label.textContent = native.options[native.selectedIndex]?.text || "Select a Grand Prix";

  const arrow = document.createElement("span");
  arrow.className = "custom-select__arrow";  // ...existing code...
  document.addEventListener("DOMContentLoaded", () => {
    const native = document.getElementById("raceSelect");
    if (!native) return;
  
    // build custom select wrapper (same as before)
    const wrapper = document.createElement("div");
    wrapper.className = "custom-select";
    native.parentNode.insertBefore(wrapper, native);
    wrapper.appendChild(native); // move native inside wrapper
    native.classList.add("native-select");
  
    // Create trigger button
    const trigger = document.createElement("button");
    trigger.type = "button";
    trigger.className = "custom-select__trigger";
    trigger.setAttribute("aria-haspopup", "listbox");
    trigger.setAttribute("aria-expanded", "false");
  
    const label = document.createElement("span");
    label.className = "custom-select__label";
    label.textContent = native.options[native.selectedIndex]?.text || "Select a Grand Prix";
  
    const arrow = document.createElement("span");
    arrow.className = "custom-select__arrow";
  
    trigger.appendChild(label);
    trigger.appendChild(arrow);
    wrapper.appendChild(trigger);
  
    // Create options list
    const optionsContainer = document.createElement("div");
    optionsContainer.className = "custom-select__options";
    optionsContainer.setAttribute("role", "listbox");
  
    // Create option elements
    Array.from(native.options).forEach((opt) => {
      const option = document.createElement("div");
      option.className = "custom-select__option";
      option.setAttribute("role", "option");
      
      const text = document.createElement("span");
      text.textContent = opt.text;
      
      const meta = document.createElement("span");
      meta.className = "custom-select__meta";
      meta.textContent = opt.value ? `#${opt.value}` : '';
      
      option.appendChild(text);
      option.appendChild(meta);
      
      if (opt.selected) {
        option.setAttribute("aria-selected", "true");
      }
  
      option.addEventListener("click", () => {
        native.value = opt.value;
        label.textContent = opt.text;
        wrapper.classList.remove("open");
        native.dispatchEvent(new Event("change"));
        
        // Update selected state
        optionsContainer.querySelectorAll(".custom-select__option")
          .forEach(o => o.setAttribute("aria-selected", "false"));
        option.setAttribute("aria-selected", "true");
      });
  
      optionsContainer.appendChild(option);
    });
  
    wrapper.appendChild(optionsContainer);
  
    // Toggle dropdown
    trigger.addEventListener("click", (e) => {
      e.preventDefault();
      wrapper.classList.toggle("open");
      trigger.setAttribute("aria-expanded", wrapper.classList.contains("open"));
    });
  
    // Close dropdown when clicking outside
    document.addEventListener("click", (e) => {
      if (!wrapper.contains(e.target)) {
        wrapper.classList.remove("open");
        trigger.setAttribute("aria-expanded", "false");
      }
    });
  
    // Stage and viewer elements
    const stage = document.querySelector('.stage');
    const plotImg = document.getElementById('plot');
  
    // Keep existing click handler for the run button
    const runBtn = document.getElementById("runBtn");
    if (runBtn) {
      runBtn.addEventListener("click", async () => {
        const gp = native.value;
        if (!gp) {
          alert("Please select a Grand Prix first!");
          return;
        }
  
        const loading = document.getElementById("loading");
        const status = document.getElementById("status");
  
        // If starting a new run, hide previous viewer and move container back to center
        if (stage) stage.classList.remove('with-plot');
        if (plotImg) {
          plotImg.classList.add('hidden');
          plotImg.src = "";
          // keep viewer aria-hidden until image is ready
          plotImg.closest('.viewer')?.setAttribute('aria-hidden', 'true');
        }
  
        // UI state handling
        if (status) status.classList.add("hidden");
        if (loading) loading.classList.remove("hidden");
  
        try {
          const response = await fetch("/run", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ round: parseInt(gp, 10) })
          });
  
          const data = await response.json();
  
          if (!response.ok) {
            throw new Error(data.error || "Server error");
          }
  
          if (data.plot && plotImg) {
            // Set up onload so layout change waits until image decoded
            plotImg.onload = () => {
              // reveal image with animation and slide container left
              plotImg.classList.remove('hidden');
              plotImg.closest('.viewer')?.setAttribute('aria-hidden', 'false');
              // small timeout to ensure CSS transitions feel natural
              requestAnimationFrame(() => {
                stage.classList.add('with-plot');
              });
              plotImg.onload = null;
            };
            plotImg.src = "data:image/png;base64," + data.plot;
          } else {
            throw new Error("No plot data received");
          }
  
        } catch (error) {
          console.error("Error:", error);
          if (status) {
            status.textContent = error.message;
            status.classList.remove("hidden");
          }
        } finally {
          if (loading) loading.classList.add("hidden");
        }
      });
    }
  });

  trigger.appendChild(label);
  trigger.appendChild(arrow);
  wrapper.appendChild(trigger);

  // Create options list
  const optionsContainer = document.createElement("div");
  optionsContainer.className = "custom-select__options";
  optionsContainer.setAttribute("role", "listbox");

  // Create option elements
  Array.from(native.options).forEach((opt) => {
    const option = document.createElement("div");
    option.className = "custom-select__option";
    option.setAttribute("role", "option");
    
    const text = document.createElement("span");
    text.textContent = opt.text;
    
    const meta = document.createElement("span");
    meta.className = "custom-select__meta";
    meta.textContent = opt.value ? `#${opt.value}` : '';
    
    option.appendChild(text);
    option.appendChild(meta);
    
    if (opt.selected) {
      option.setAttribute("aria-selected", "true");
    }

    option.addEventListener("click", () => {
      native.value = opt.value;
      label.textContent = opt.text;
      wrapper.classList.remove("open");
      native.dispatchEvent(new Event("change"));
      
      // Update selected state
      optionsContainer.querySelectorAll(".custom-select__option")
        .forEach(o => o.setAttribute("aria-selected", "false"));
      option.setAttribute("aria-selected", "true");
    });

    optionsContainer.appendChild(option);
  });

  wrapper.appendChild(optionsContainer);

  // Toggle dropdown
  trigger.addEventListener("click", (e) => {
    e.preventDefault();
    wrapper.classList.toggle("open");
    trigger.setAttribute("aria-expanded", wrapper.classList.contains("open"));
  });

  // Close dropdown when clicking outside
  document.addEventListener("click", (e) => {
    if (!wrapper.contains(e.target)) {
      wrapper.classList.remove("open");
      trigger.setAttribute("aria-expanded", "false");
    }
  });

  // Keep existing click handler for the run button
  const runBtn = document.getElementById("runBtn");
  if (runBtn) {
    runBtn.addEventListener("click", async () => {
      const gp = native.value;
      if (!gp) {
        alert("Please select a Grand Prix first!");
        return;
      }

      const loading = document.getElementById("loading");
      const plotImg = document.getElementById("plot");
      const status = document.getElementById("status");

      // UI state handling
      if (status) status.classList.add("hidden");
      if (loading) loading.classList.remove("hidden");
      if (plotImg) {
        plotImg.classList.add("hidden");
        plotImg.src = "";
      }

      try {
        const response = await fetch("/run", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ round: parseInt(gp, 10) })
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Server error");
        }

        if (data.plot && plotImg) {
          plotImg.src = "data:image/png;base64," + data.plot;
          plotImg.classList.remove("hidden");
        } else {
          throw new Error("No plot data received");
        }

      } catch (error) {
        console.error("Error:", error);
        if (status) {
          status.textContent = error.message;
          status.classList.remove("hidden");
        }
      } finally {
        if (loading) loading.classList.add("hidden");
      }
    });
  }
});