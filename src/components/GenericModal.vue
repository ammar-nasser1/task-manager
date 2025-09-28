<template>
  <teleport to="body">
    <transition name="modal" appear>
      <div
        v-if="modelValue"
        class="fixed inset-0 w-full h-full bg-black/30 flex justify-center items-center z-[1000] backdrop-blur-sm"
        @click="closeOnBackdrop && closeModal()"
        @keydown.esc="closeOnEscape && closeModal()"
        :aria-labelledby="title ? 'modal-title' : undefined"
      >
        <div
          class="bg-white rounded-[20px] shadow-lg max-h-[90vh] overflow-y-auto m-4 relative w-full"
          :class="[sizeClasses, customClass]"
          @click.stop
        >
          <div
            v-if="title || showClose"
            class="flex justify-between items-center pt-6 px-6 border-b border-gray-200 mb-4 pb-4"
            :class="{ '!border-b-0': !title }"
          >
            <div class="flex items-center gap-2 justify-between">
              <img
                v-if="showHeaderIcon"
                :src="headerIcon"
                alt="closeIcon"
                class="cursor-pointer mb-2"
              />
              <h3
                v-if="title"
                id="modal-title"
                class="text-lg font-medium text-gray-800 font-[Montserrat-Arabic] text-left capitalize m-0 leading-[18px]"
              >
                {{ title }}
              </h3>
            </div>
          </div>

          <div class="px-6 pb-6">
            <slot></slot>
          </div>

          <div
            v-if="showFooter || $slots.footer"
            class="pt-4 px-6 pb-6 border-t border-gray-200 flex flex-col justify-end gap-3"
          >
            <slot name="footer">
              <template
                v-if="showFooter && !$slots.footer"
                class="flex flex-col"
              >
                <button
                  v-if="showConfirmButton"
                  @click="confirmAction"
                  class="w-full border-none rounded-md cursor-pointer font-medium transition-all duration-200 text-sm h-10 bg-[#1b1f27] text-white hover:bg-[#1b1f27]"
                  :disabled="isLoading"
                >
                  {{ isLoading ? "جاري التحميل" : confirmText }}
                </button>
                <button
                  v-if="showCancelButton"
                  @click="closeModal"
                  class="w-full border-none rounded-md cursor-pointer font-medium transition-all duration-200 text-sm h-10 bg-[#e1e6ef] text-[#3c757d] hover:bg-[#e1e6ef]"
                >
                  {{ cancelText }}
                </button>
              </template>
            </slot>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import {
  defineProps,
  defineEmits,
  onMounted,
  onUnmounted,
  computed,
} from "vue";

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: "",
  },
  size: {
    type: String,
    default: "medium",
    validator: (value) =>
      ["small", "medium", "large", "xlarge", "fullscreen"].includes(value),
  },
  closeOnBackdrop: {
    type: Boolean,
    default: true,
  },
  closeOnEscape: {
    type: Boolean,
    default: true,
  },
  showClose: {
    type: Boolean,
    default: true,
  },
  customClass: {
    type: String,
    default: "",
  },
  showFooter: {
    type: Boolean,
    default: false,
  },
  showCancelButton: {
    type: Boolean,
    default: true,
  },
  showConfirmButton: {
    type: Boolean,
    default: true,
  },
  cancelText: {
    type: String,
    default: "cancel",
  },
  confirmText: {
    type: String,
    default: "save",
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  showHeaderIcon: {
    type: Boolean,
    default: false,
  },
  headerIcon: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:modelValue", "close", "confirm"]);

const sizeClasses = computed(() => {
  const sizeMap = {
    small: "max-w-[400px]",
    medium: "max-w-[600px]",
    large: "max-w-[800px]",
    xlarge: "max-w-[1000px]",
    fullscreen:
      "w-[95vw] h-[95vh] max-w-none max-h-none sm:w-[100vw] sm:h-[100vh] sm:rounded-none",
  };
  return sizeMap[props.size];
});

const closeModal = () => {
  emit("update:modelValue", false);
  emit("close");
};

const confirmAction = () => {
  emit("confirm");
};

const lockBodyScroll = () => {
  document.body.style.overflow = "hidden";
};

const unlockBodyScroll = () => {
  document.body.style.overflow = "";
};

onMounted(() => {
  if (props.modelValue) {
    lockBodyScroll();
  }
});

onUnmounted(() => {
  unlockBodyScroll();
});

import { watch } from "vue";
watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal) {
      lockBodyScroll();
    } else {
      unlockBodyScroll();
    }
  }
);
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  transition: all 0.3s ease;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(0.9) translateY(-50px);
  opacity: 0;
}

@media (max-width: 640px) {
  .modal-container {
    @apply m-2 rounded-none;
  }
}
</style>
