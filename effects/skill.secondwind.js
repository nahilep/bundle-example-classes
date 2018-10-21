'use strict';

const { Broadcast, EffectFlag, Heal } = require('ranvier');

/**
 * Implementation effect for second wind skill
 */
module.exports = {
  config: {
    name: 'Second Wind',
    type: 'skill:secondwind'
  },
  flags: [EffectFlag.BUFF],
  listeners: {
    damaged: function (damage) {
      if (damage.attribute !== 'energy') {
        return;
      }

      if (this.skill.onCooldown(this.target)) {
        return;
      }

      if ((this.target.getAttribute('energy') / this.target.getMaxAttribute('energy')) * 100 > this.state.threshold) {
        return;
      }

      Broadcast.sayAt(this.target, "<bold><yellow>You catch a second wind!</bold></yellow>");
      const heal = new Heal({
        amount: Math.floor(this.target.getMaxAttribute('energy') * (this.state.restorePercent / 100)),
        attacker: this.target,
        attribute: 'energy',
        source: this.skill
      });
      heal.commit(this.target);

      this.skill.cooldown(this.target);
    }
  }
};
