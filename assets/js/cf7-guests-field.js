(function () {
  'use strict';

  function toInt(value, fallback) {
    var parsed = parseInt(value, 10);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function buildAgeFields(wrapper, count) {
    var ageBox = wrapper.querySelector('.cf7-guests-child-ages');
    if (!ageBox) return;

    var ageName = ageBox.getAttribute('data-age-name');
    var existing = Array.prototype.map.call(ageBox.querySelectorAll('input'), function (input) {
      return input.value;
    });

    ageBox.innerHTML = '';

    for (var i = 0; i < count; i++) {
      var row = document.createElement('div');
      row.className = 'cf7-guests-age-row';

      var label = document.createElement('label');
      label.textContent = 'Child ' + (i + 1) + ' age';

      var input = document.createElement('input');
      input.type = 'number';
      input.name = ageName;
      input.min = '0';
      input.max = '17';
      input.className = 'cf7-guests-child-age';
      input.value = existing[i] || '';
      input.required = true;

      row.appendChild(label);
      row.appendChild(input);
      ageBox.appendChild(row);
    }
  }

  function setupGuestsField(wrapper) {
    var totalInput = wrapper.querySelector('.cf7-guests-total');
    var panel = wrapper.querySelector('.cf7-guests-panel');
    var adultsInput = wrapper.querySelector('.cf7-guests-adults');
    var childrenInput = wrapper.querySelector('.cf7-guests-children');

    if (!totalInput || !panel || !adultsInput || !childrenInput) return;

    var min = toInt(wrapper.getAttribute('data-min'), 0);
    var max = toInt(wrapper.getAttribute('data-max'), 20);

    function syncFromTotal() {
      var total = clamp(toInt(totalInput.value, 0), min, max);
      totalInput.value = total;

      if (total > 0) {
        panel.hidden = false;
      } else {
        panel.hidden = true;
      }

      var adults = clamp(toInt(adultsInput.value, total), 0, total);
      var children = clamp(toInt(childrenInput.value, 0), 0, total);

      if (adults + children !== total) {
        adults = total;
        children = 0;
      }

      adultsInput.max = total;
      childrenInput.max = total;
      adultsInput.value = adults;
      childrenInput.value = children;
      buildAgeFields(wrapper, children);
    }

    function syncSplit(changed) {
      var total = clamp(toInt(totalInput.value, 0), min, max);
      var adults = clamp(toInt(adultsInput.value, 0), 0, total);
      var children = clamp(toInt(childrenInput.value, 0), 0, total);

      if (changed === 'adults') {
        children = total - adults;
      } else {
        adults = total - children;
      }

      adultsInput.value = adults;
      childrenInput.value = children;
      buildAgeFields(wrapper, children);
    }

    totalInput.addEventListener('input', syncFromTotal);
    adultsInput.addEventListener('input', function () { syncSplit('adults'); });
    childrenInput.addEventListener('input', function () { syncSplit('children'); });

    syncFromTotal();
  }

  function init() {
    document.querySelectorAll('.cf7-guests-field').forEach(setupGuestsField);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
