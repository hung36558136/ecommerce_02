module RenderSortableTreeHelper
  module Render
    class << self
      attr_accessor :h, :options

      def render_node h, options
        @h, @options = h, options
        node = options[:node]
        html = "<li data-node-id='#{node.id}'><div class='item'>"
        unless options[:children].blank?
          html += "<i class='handle fa fa-plus show_sub_category'
            id='#{node.id}'></i>"
        end
        html + "#{show_link} #{controls}<hr></div>
          <div id='sub_category_#{node.id}' class='sub_category'>
          #{children}</div></li>"
      end

      def show_link
        node = options[:node]
        url = h.url_for(controller: options[:klass].pluralize, action: :show,
          id: node)
        title_field = options[:title]
        "<span class='name_category'>
          #{node.send(title_field)}</span>"
      end

      def controls
        node = options[:node]
        destroy_path = h.url_for(controller: options[:klass].pluralize,
          action: :destroy, id: node)
        view = ActionView::Base.new ActionController::Base.view_paths
        view.extend ApplicationHelper
        "<div class='controls'>
          <table>
            <tr class='action_category_control'>
              <td>#{node.products.length} product</td>
              <td>#{h.button_tag I18n.t('admin.categories.detail.edit'),
                class: 'btn btn-default btn-edit-category', id: node.id}</td>
              <td>#{h.link_to I18n.t('admin.categories.detail.delete'),
                destroy_path, class: 'btn btn-default', method: :delete,
                data: {confirm: I18n.t('admin.categories.detail.confirm_message')}}
              </td>
            </tr>
          </table>
          #{view.render partial: "admin/categories/edit",
            locals: {category: node}}
        </div>"
      end

      def children
        unless options[:children].blank?
          "<ol class='nested_set'>#{options[:children]}</ol>"
        end
      end
    end
  end
end
