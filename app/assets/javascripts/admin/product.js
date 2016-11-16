var product = {
  initialize: function () {
    $('#btn-create-product').click(function () {
      $('#md-create-product').modal();
    });
    $('#btn-advance-search').click(function () {
      if ($('#content-advance-search').css('display') === 'none') {
        $('#content-advance-search').css('display', 'block');
      } else {
        $('#content-advance-search').css('display', 'none');
      }
    });
    $('.category_product').each(function () {
      $(this).select2({
        theme: 'bootstrap'
      });
    });
    $('.manufacturer_select').each(function () {
      $(this).select2({
        theme: 'bootstrap'
      });
    });
    $('#btn-add-spec').click(function (event) {
      event.preventDefault();
      product.on_click_add_specification();
    });
    $('#btn-create').click(function (event) {
      event.preventDefault();
      product.create_product();
    });
    $('.btn-delete-spec').each(function () {
      $(this).on('click', function (event) {
        event.preventDefault();
        if ($('.btn-delete-spec').length == 2) {
          alert(I18n.t('js.product.message_min_field'));
          return;
        }
        $(this).parent().parent().remove();
      });
    });
  },
  
  on_click_add_specification: function () {
    $('#content-spec').append($('#field-spec-create').html());
  },
  
  create_product: function () {
    var product = {};
    product.name = $('#name').val();
    if (product.name == '') {
      alert(I18n.t('js.product.message_blank_name'));
      return;
    }
    product.category_id = $('#category_product').val();
    product.manufacturer_id = $('#manufacturer_select').val();
    var specifications = [];
    var spec_name = $('input[name=spec-name]');
    var spec_value = $('input[name=spec-value]');
    for (var i = 0; i < $(spec_name).length - 1; i++) {
      var name = $(spec_name[i]).val();
      var value = $(spec_value[i]).val();
      if (name == '' || value == '') {
        alert(I18n.t('js.product.message_blank_field'));
        return;
      }
      var specification = {
        name: name,
        value: value
      };
      specifications.push(specification);
    }
    product.specifications = specifications;
    $.post(I18n.t('js.url_admin_product'), {product: product},
      function (data, status) {
        try {
          jQuery.parseJSON(data);
          alert(data);
        } catch (err) {
          for (var i = 0; i < $(spec_value).length - 1; i++) {
            $(spec_value[i]).val('');
          }
          if (!$('#cb_keep_save').is(':checked')) {
            $('#md-create-product').modal('hide');
          }
        }
      }, 'html');
  }
};
