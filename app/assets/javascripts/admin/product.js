var product = {
  is_advance_search: false,
  
  initialize: function () {
    if (utils.url_param('search_params[term]')) {
      $('#tf-search-product').val(utils.url_param('search_params[term]'));
    }
    $('#btn-create-product').click(function () {
      $('#md-create-product').modal();
    });
    $('#btn-advance-search').click(function () {
      if (product.is_advance_search == false) {
        $('#content-advance-search').css('display', 'block');
        product.is_advance_search = true;
      } else {
        $('#content-advance-search').css('display', 'none');
        product.is_advance_search = false;
      }
    });
    $('#btn-search-product').click(function (event) {
      event.preventDefault();
      product.search_product();
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
        var id = '';
        if ($(this).attr('id')) {
          id = '-' + $(this).attr('id');
        }
        if ($('button[name=btn-delete-spec' + id + ']').length < 3) {
          alert(I18n.t('js.product.message_min_field'));
          return;
        }
        var id_specification = $(this).prev().attr('id');
        var ids_destroy = $('#ids-destroy' + id).val() + id_specification + ',';
        $('#ids-destroy' + id).val(ids_destroy);
        $(this).parent().parent().remove();
      });
    });
    utils.on_check_delete('cb-delete-product', 'cb-all-product');
    $('#category_search').select2({
      theme: 'bootstrap'
    });
    $('#manufacturer_search').select2({
      theme: 'bootstrap'
    });
    $('.btn-edit-product').each(function () {
      $(this).on('click', function (event) {
        event.preventDefault();
        product.show_edit_modal($(this));
      });
    });
    $('.btn-add-spec-edit').each(function () {
      $(this).on('click', function (event) {
        event.preventDefault();
        product.on_click_add_specification($(this).attr('id'));
      })
    });
    $('.btn-save-product').each(function () {
      $(this).on('click', function (event) {
        event.preventDefault();
        var id = $(this).attr('id');
        product.save_product(id);
      });
    });
    $('.btn-delete-product').each(function () {
      $(this).on('click', function (event) {
        event.preventDefault();
        var ids = [];
        ids.push($(this).attr('id'));
        product.delete_products(ids);
      });
    });
    $('#btn-delete-products').click(function (event) {
      event.preventDefault();
      var ids = [];
      $('input[name=cb-delete-product]').each(function () {
        if ($(this).is(':checked')) {
          ids.push($(this).val());
        }
      });
      product.delete_products(ids);
    });
  },
  
  save_product: function (id) {
    var product_params = product.build_product_params(id);
    if (product_params == false) {
      return;
    }
    var specifications = product_params.specifications;
    var ids_destroy = $('#ids-destroy-' + id).val().split(',');
    $(ids_destroy).each(function (i) {
      if (ids_destroy[i] != '') {
        var specification = {
          id: ids_destroy[i],
          _destroy: true
        };
        specifications.push(specification);
      }
    });
    $.ajax({
      url: I18n.t('js.url_admin_product'),
      data: {product: product_params},
      type: 'PUT',
      dataType: 'json',
      success: function (data, status) {
        if (data == true) {
          location.reload();
        } else {
          alert(data);
        }
      }
    });
  },
  
  on_click_add_specification: function (id) {
    if (!id) {
      id = '';
    } else {
      id = '-' + id;
    }
    $('#content-spec' + id)
      .append($('#field-spec-create' + id).html());
    $('#content-spec' + id).find('.btn-delete-spec').last()
      .on('click', function (event) {
        event.preventDefault();
        if ($('button[name=btn-delete-spec' + id + ']').length < 3) {
          alert(I18n.t('js.product.message_min_field'));
          return;
        }
        $(this).parent().parent().remove();
      });
  },
  
  create_product: function () {
    var product_params = product.build_product_params();
    if (product_params == false) {
      return;
    }
    $.post(I18n.t('js.url_admin_product'), {product: product_params},
      function (data, status) {
        try {
          jQuery.parseJSON(data);
          alert(data);
        } catch (err) {
          for (var i = 0; i < $('input[name=spec-value]').length - 1; i++) {
            $('input[name=spec-value]').val('');
          }
          if (!$('#cb_keep_save').is(':checked')) {
            $('#md-create-product').modal('hide');
          }
          $('#content-products').prepend(data);
          utils.on_check_delete('cb-delete-product', 'cb-all-product');
        }
      }, 'html');
  },
  
  build_product_params: function (id) {
    var product_params = {};
    if (id) {
      product_params.id = id;
      id = '-' + id;
    } else {
      id = '';
    }
    product_params.name = $('#name' + id).val();
    if (product_params.name == '') {
      alert(I18n.t('js.product.message_blank_name'));
      return false;
    }
    if ($('#price' + id).val() == '') {
      alert(I18n.t('js.product.message_blank_price'));
      return false;
    }
    product_params.price = parseFloat($('#price' + id).val());
    if (isNaN(product_params.price)) {
      alert(I18n.t('js.product.message_price'));
      return false;
    }
    product_params.category_id = $('#category_product' + id).val();
    product_params.manufacturer_id = $('#manufacturer_select' + id).val();
    var specifications = [];
    var spec_name = $('input[name=spec-name' + id + ']');
    var spec_value = $('input[name=spec-value' + id + ']');
    for (var i = 0; i < $(spec_name).length - 1; i++) {
      var name = $(spec_name[i]).val();
      var value = $(spec_value[i]).val();
      var id_specification = $(spec_name[i]).attr('id');
      if (name == '' || value == '') {
        alert(I18n.t('js.product.message_blank_field'));
        return false;
      }
      var specification = {
        name: name,
        value: value
      };
      if (id_specification) {
        specification.id = id_specification;
      }
      specifications.push(specification);
    }
    product_params.specifications = specifications;
    return product_params;
  },
  
  delete_products: function (ids) {
    if (confirm(I18n.t('js.product.confirm_delete'))) {
      $.ajax({
        url: I18n.t('js.url_admin_product'),
        method: 'DELETE',
        data: {ids: ids},
        dataType: 'text',
        success: function (data, status) {
          var res = jQuery.parseJSON(data);
          var message = I18n.t('js.deleted') + res['deleted'] + ' ' +
            I18n.t('js.not_deleted') + res['not_deleted'];
          alert(message);
          location.reload();
        }
      });
    }
  },
  
  search_product: function () {
    var search_params = {};
    search_params.term = $('#tf-search-product').val();
    if (product.is_advance_search) {
      if ($('#category_search').val() != '') {
        search_params.category_id = $('#category_search').val();
      }
      if ($('#manufacturer_search').val() != '') {
        search_params.manufacturer_id = $('#manufacturer_search').val();
      }
      if ($('#min-price-search').val() != '') {
        search_params.min_price = parseFloat($('#min-price-search').val());
        if (isNaN(search_params.min_price)) {
          alert(I18n.t('js.product.message_price'));
          return;
        }
        if (search_params.min_price < 0) {
          alert(I18n.t('js.product.message_min_price'));
          return;
        }
      }
      if ($('#max-price-search').val() != '') {
        search_params.max_price = parseFloat($('#max-price-search').val());
        if (isNaN(search_params.max_price)) {
          alert(I18n.t('js.product.message_price'));
          return;
        }
        if (search_params.max_price < 0) {
          alert(I18n.t('js.product.message_max_price'));
          return;
        }
      }
      if (!isNaN(search_params.max_price) && !isNaN(search_params.min_price)
        && search_params.max_price < search_params.min_price) {
        alert(I18n.t('js.product.message_min_max_price'));
        return;
      }
    }
    $.get(I18n.t('js.url_admin_product'),
      {search_params: search_params},
      function (data, status) {
        $('#list-product').html(data);
      }, 'html');
  },
  
  show_edit_modal: function (obj) {
    var id = $(obj).attr('id');
    $('#md-edit_product-' + id).modal();
  }
};
