polarity.export = PolarityComponent.extend({
    details: Ember.computed.alias('block.data.details'),
    timezone: Ember.computed('Intl', function() {
      return Intl.DateTimeFormat().resolvedOptions().timeZone;
    }),

    actions: {
      toggleScanner() {
            this.toggleProperty('isShowingDiv');
        },
      toggleVisibility() {
      this.toggleProperty('showEmail');
    }
    }

});
