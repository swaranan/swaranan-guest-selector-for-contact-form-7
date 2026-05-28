(function ($) {
  'use strict';

  // Compatibility fallback for older/newer Contact Form 7 admin screens where the PHP tag generator
  // is registered but Contact Form 7 does not auto-build the generated shortcode.
  $(document).on('change keyup', '.tag-generator-panel input', function () {
    var $panel = $(this).closest('.tag-generator-panel');
    var $tag = $panel.find('input.tag[name="guest_selector"]');
    if (!$tag.length) return;

    var name = $.trim($panel.find('input.tg-name').val() || 'guests');
    var required = $panel.find('input[name="required"]').is(':checked') ? '*' : '';
    var parts = ['guest_selector' + required, name];

    $panel.find('input.option').each(function () {
      var $input = $(this);
      var inputName = $input.attr('name');
      var value = $input.val();

      if (!inputName || inputName === 'name') return;

      if ($input.attr('type') === 'checkbox') {
        if ($input.is(':checked')) parts.push(inputName);
        return;
      }

      if (value !== '') {
        if (inputName === 'id') parts.push('id:' + value);
        else if (inputName === 'class') parts.push('class:' + value);
        else if (inputName === 'label') parts.push('label:' + value.replace(/\s+/g, '_'));
        else parts.push(inputName + ':' + value);
      }
    });

    $tag.val('[' + parts.join(' ') + ']');
    $panel.find('input.mail-tag').val('[' + name + ']');
  });
})(jQuery);
