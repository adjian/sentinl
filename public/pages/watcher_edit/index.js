import { uiModules } from 'ui/modules';
import { Notifier } from 'ui/notify/notifier';
import routes from 'ui/routes';

import './services/wizard_helper';
import './services/watcher_editor_es_service';
import './components/threshold_watcher_edit';
import './components/title_panel_watcher_edit';
import './components/title_panel_watcher_edit/components/watcher_edit_human_schedule';
import './components/title_panel_watcher_edit/components/watcher_edit_every_schedule';
import './components/title_panel_watcher_edit/components/watcher_edit_add_index';
import './components/condition_panel_watcher_edit';
import './components/condition_panel_watcher_edit/services/watcher_editor_chart_service';
import './components/condition_panel_watcher_edit/components/dd_watcher_agg_type';
import './components/condition_panel_watcher_edit/components/dd_watcher_agg_field';
import './components/condition_panel_watcher_edit/components/dd_watcher_agg_over';
import './components/condition_panel_watcher_edit/components/dd_watcher_agg_time';
import './components/condition_panel_watcher_edit/components/dd_watcher_agg_interval';
import './components/condition_panel_watcher_edit/components/dd_watcher_agg_threshold';
import './components/action_panel_watcher_edit';
import './components/action_panel_watcher_edit/components/watcher_edit_add_action';
import './components/action_panel_watcher_edit/components/watcher_edit_email_action';
import './components/action_panel_watcher_edit/components/watcher_edit_report_action';

import template from './watcher_edit.html';
import controller from './watcher_edit';

routes
  .when('/watcher/:id/edit')
  .when('/watcher/:type/new')
  .defaults(/watcher\/(:id\/edit|:type\/new)/, {
    template,
    controller,
    controllerAs: 'watcherEdit',
    bindToController: true,
    resolve: {
      watcher: function ($injector) {
        const $route = $injector.get('$route');
        const kbnUrl = $injector.get('kbnUrl');
        const watcherService = $injector.get('Watcher');
        const notifier = new Notifier({ location: 'Watcher' });
        const watcherId = $route.current.params.id;

        let spyBtnWatcher;
        try {
          if (window.localStorage.sentinl_saved_query && !!window.localStorage.sentinl_saved_query.length) {
            spyBtnWatcher = JSON.parse(window.localStorage.sentinl_saved_query);
            delete window.localStorage.sentinl_saved_query;
          }
        } catch (err) {
          notifier.error(`parse spy button watcher: ${err.message}`);
          kbnUrl.redirect('/');
        }

        if (!watcherId) {
          return watcherService.new('watcher').then(function (watcher) {
            if (spyBtnWatcher) {
              watcher._source = spyBtnWatcher._source;
            }
            return watcher;
          }).catch(function (err) {
            notifier.error(`create new watcher: ${err.message}`);
            kbnUrl.redirect('/');
          });
        }

        return watcherService.get(watcherId).catch(function (err) {
          notifier.error(`get watcher: ${err.message}`);
          kbnUrl.redirect('/');
        });
      },
    },
  });
