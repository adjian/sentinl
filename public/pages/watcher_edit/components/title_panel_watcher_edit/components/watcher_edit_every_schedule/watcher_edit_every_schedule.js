import template from './watcher_edit_every_schedule.html';
import { get } from 'lodash';

class WatcherEditEverySchedule {
  constructor($scope, sentinlConfig) {
    this.$scope = $scope;
    this.watcher = this.watcher || this.$scope.watcher;
    this.onSelect = this.onSelect || this.$scope.onSelect;

    this.schedule_timezone = get(sentinlConfig, 'es.watcher.schedule_timezone'); // local, utc
    this.selected = 'minutes';
    this.options = ['seconds', 'minutes', 'hours', 'days', 'months', 'years'];
    this.number = this._getNumber();
  }

  _getNumber() {
    const number = /every\s(\d+)\s\w+/.exec(this.watcher._source.trigger.schedule.later);
    if (!number) return 1;
    return +number[1];
  }

  handleChange() {
    this.onSelect({mode: 'every', text: this.schedule});
  }

  get schedule() {
    return `every ${this.number} ${this.selected}`;
  }
}

function watcherEditEverySchedule() {
  return {
    template,
    restrict: 'E',
    scope: {
      watcher: '=',
      onSelect: '&',
    },
    controller:  WatcherEditEverySchedule,
    controllerAs: 'watcherEditEverySchedule',
    bindToController: {
      watcher: '=',
      onSelect: '&',
    },
  };
}

export default watcherEditEverySchedule;
