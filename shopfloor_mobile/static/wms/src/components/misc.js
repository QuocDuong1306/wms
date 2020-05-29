/* eslint-disable strict */
import {ItemDetailMixin} from "./detail/detail_mixin.js";

Vue.component("reset-screen-button", {
    props: ["show_reset_button"],
    methods: {
        reset: function() {
            this.$emit("reset");
        },
    },
    template: `
        <div class="action reset" v-if="show_reset_button">
            <v-form class="m-t5"  v-on:reset="reset">
                <v-btn color="warning" x-large @click="reset">Reset</v-btn>
            </v-form>
        </div>
    `,
});

Vue.component("cancel-button", {
    template: `
        <div class="action reset">
            <v-btn x-large color="error" v-on:click="$emit('cancel')">Cancel</v-btn>
        </div>
    `,
});

// TODO: could be merged w/ userConfirmation
Vue.component("last-operation", {
    // Props: ['info'],
    data: function() {
        return {info: {}};
    },
    template: `
    <div class="last-operation">
        <v-dialog persistent fullscreen tile value=true>
            <v-alert tile type="info" prominent transition="scale-transition">
                <v-card outlined color="blue lighten-1" class="message mt-10">
                    <v-card-title>This was the last operation of the document.</v-card-title>
                    <v-card-text>The next operation is ready to be processed.</v-card-text>
                </v-card>
                <v-form class="mt-10">
                    <v-btn x-large color="success" @click="$emit('confirm')">OK</v-btn>
                </v-form>
            </v-alert>
        </v-dialog>
    </div>
    `,
});

Vue.component("get-work", {
    template: `
    <div class="get-work fullscreen-buttons fullscreen-buttons-50">
      <btn-action id="btn-get-work" color="success" @click="$emit('get_work')">
          Get work
      </btn-action>
      <v-btn id="btn-manual" color="default" @click="$emit('manual_selection')">
          Manual selection
      </v-btn>
    </div>
    `,
});

Vue.component("stock-zero-check", {
    template: `
    <div class="stock-zero-check">
      <v-dialog fullscreen tile value=true class="actions fullscreen">
        <v-card>
          <div class="button-list button-vertical-list">
            <v-row align="center">
              <v-col class="text-center" cols="12">
                <v-btn x-large color="primary" @click="$emit('action', 'action_confirm_zero')">Confirm stock = 0</v-btn>
              </v-col>
            </v-row>
            <v-row align="center">
              <v-col class="text-center" cols="12">
                <v-btn x-large color="warning" @click="$emit('action', 'action_confirm_not_zero')">Confirm stock NOT empty</v-btn>
              </v-col>
            </v-row>
          </div>
        </v-card>
      </v-dialog>
    </div>
  `,
});

Vue.component("state-display-info", {
    props: {
        info: Object,
    },
    template: `
  <div class="state-display-info" v-if="info.title">
    <v-alert tile dense type="info" :icon="false">
      <div class="state-title">{{ info.title }}</div>
    </v-alert>
  </div>
`,
});

Vue.component("edit-action", {
    props: {
        record: Object,
        options: {
            type: Object,
            default: function() {
                return {
                    click_event: "edit",
                };
            },
        },
    },
    template: `
<div class="action action-edit">
  <v-btn icon class="edit" x-large rounded color="default"
         @click="$root.trigger(options.click_event, record)"><v-icon>mdi-pencil-outline</v-icon></v-btn>
</div>
`,
});

Vue.component("separator-title", {
    template: `
  <h3 class="separator-title"><slot></slot></h3>
`,
});

Vue.component("cancel-move-line-action", {
    props: ["record"],
    data() {
        return {
            dialog: false,
        };
    },
    methods: {
        on_user_confirm: function(answer) {
            this.dialog = false;
            if (answer === "yes") {
                let data = {};
                if (this.record.package_dest) {
                    data = {package_id: this.record.package_dest.id};
                } else {
                    data = {line_id: this.record.id};
                }
                this.$root.trigger("cancel_picking_line", data);
            }
        },
    },
    computed: {
        message: function() {
            const item = this.record.package_dest
                ? this.record.package_dest.name
                : this.record.product.name;
            return "Please confirm cancellation for " + item;
        },
    },
    template: `
<div class="action action-destroy">
  <v-dialog v-model="dialog" fullscreen tile class="actions fullscreen text-center">
    <template v-slot:activator="{ on }">
      <v-btn icon class="destroy" x-large rounded color="error" v-on="on"><v-icon>mdi-close-circle</v-icon></v-btn>
    </template>
    <v-card>
      <user-confirmation
          v-on:user-confirmation="on_user_confirm"
          v-bind:question="message"></user-confirmation>
    </v-card>
  </v-dialog>
</div>
`,
});

Vue.component("picking-list-item-progress-bar", {
    mixins: [ItemDetailMixin],
    computed: {
        value() {
            return this.utils.misc.picking_completeness(this.record);
        },
    },
    template: `
  <div :class="$options._componentTag">
    <v-progress-linear :value="value" color="success" height="8"></v-progress-linear>
  </div>
`,
});

// handy component to place UI todos
Vue.component("todo", {
    template: `
<div :class="$options._componentTag">
  <div class="message">
    <v-icon>mdi-hammer-wrench</v-icon> <strong>TODO: <small><slot></slot></small></strong>
  </div>
</div>
`,
});

// TODO: use color registry for the icon color
Vue.component("btn-info-icon", {
    props: {
        color: {
            type: String,
        },
    },
    template: `
    <v-icon :color="color || utils.colors.color_for('info_icon')">mdi-information</v-icon>
`,
});

// TODO: move to separated file
Vue.component("btn-action", {
    props: {
        action: {
            type: String,
            default: "",
        },
        color: {
            type: String,
            default: "",
        },
    },
    computed: {
        btn_color() {
            let color = this.color;
            if (!color) {
                color = this.utils.colors.color_for(
                    this.action ? "btn_action_" + this.action : "btn_action"
                );
            }
            return color;
        },
    },
    template: `
  <v-btn x-large v-bind="$attrs" v-on="$listeners" :color="btn_color">
    <slot></slot>
  </v-btn>
`,
});

Vue.component("btn-back", {
    methods: {
        on_back: function() {
            this.$root.trigger("go_back");
            this.$router.back();
        },
    },
    template: `
<btn-action v-bind="$attrs" action="back" v-on:click="on_back">
  <v-icon>mdi-keyboard-backspace</v-icon>{{ $t("btn.back.title") }}
</btn-action>
`,
});
