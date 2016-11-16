//= require jquery
//= require jquery-ui
//= require jquery_ujs
//= require turbolinks
//= require i18n
//= require i18n/translations
//= require bootstrap.min
//= require bootstrapValidator.min
//= require select2
//= require select2-full
//= require select2_locale_en
//= require jquery.ui.nestedSortable
//= require sortable_tree/initializer
//= require utils
//= require cable
//= require_tree ./admin

$(document).on('turbolinks:load', function () {
  category.initialize();
  user.initialize();
  manufacturer.initialize();
});
