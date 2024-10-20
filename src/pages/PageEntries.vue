<template>
  <q-page>
    <div class="q-pa-md">
      <q-list bordered separator>
        <!--  q-slide-item -->
        <q-slide-item
          v-for="entry in entries"
          :key="entry.id"
          @right="onEntrySlideRight(entry)"
          left-color="positive"
          right-color="negative"
        >
          <template v-slot:left>
            <q-icon name="done" />
          </template>
          <template v-slot:right>
            <q-icon name="clear" />
          </template>

          <q-item>
            <q-item-section
              class="text-weight-bold"
              :class="useAmountColorClass(entry.amount)"
            >
              {{ entry.name }}
            </q-item-section>

            <q-item-section
              side
              class="text-weight-bold"
              :class="useAmountColorClass(entry.amount)"
            >
              {{ useCurrencify(entry.amount) }}
            </q-item-section>
          </q-item>
        </q-slide-item>
      </q-list>
    </div>

    <q-footer class="bg-transparent">
      <div class="row q-mb-sm q-px-md q-py-sm shadow-up-3">
        <div class="col text-grey-7 text-h6">Balans:</div>
        <div
          class="col text-h6 text-right"
          :class="useAmountColorClass(balance)"
        >
          {{ useCurrencify(balance) }}
        </div>
      </div>

      <q-form
        v-model="addEntryform"
        @submit="addEntry"
        class="row q-pa-sm q-pb-sm q-col-gutter-sm bg-primary"
      >
        <div class="col">
          <q-input
            v-model="addEntryform.name"
            ref="name"
            placeholder="Name"
            outlined
            bg-color="white"
            dense
          />
        </div>
        <div class="col">
          <q-input
            v-model.number="addEntryform.amount"
            input-class="text-right"
            placeholder="Amount"
            type="number"
            step="0.01"
            outlined
            bg-color="white"
            dense
          />
        </div>
        <div class="col col-auto">
          <q-btn type="submit" round color="primary" icon="add" />
        </div>
      </q-form>
    </q-footer>
  </q-page>
</template>

<script setup>
import { computed, ref, reactive } from "vue";
import { uid, useQuasar } from "quasar";
import { useCurrencify } from "src/use/useCurrencify";
import { useAmountColorClass } from "src/use/useAmountColorClass";

const { $q } = useQuasar();

// Kontrollera om $q är definierat (felsökning)
console.log("$q:", $q);

const entries = ref([
  { id: 1, name: "Salary", amount: 4999 },
  { id: 2, name: "Rent", amount: -1000 },
  { id: 3, name: "Groceries", amount: -200 },
  { id: 4, name: "Unknown", amount: 0 },
]);

const balance = computed(() => {
  return entries.value.reduce((acc, entry) => acc + entry.amount, 0);
});

const nameRef = ref(null);
const addEntryformDefault = { name: "", amount: 0 };
const addEntryform = reactive({ ...addEntryformDefault });

const addEntryFormReset = () => {
  Object.assign(addEntryform, addEntryformDefault);
  nameRef.value.focus();
};

const addEntry = () => {
  if (!addEntryform.name || addEntryform.amount === 0) return;
  const newEntry = { ...addEntryform, id: uid() };
  entries.value.push(newEntry);
  addEntryFormReset();
};

const onEntrySlideRight = (entry) => {
  try {
    if (!entry) throw new Error("Entry is undefined or null");
    $q.dialog({
      title: "Delete Entry",
      message: `Are you sure you want to delete "${entry.name}"?`,
      cancel: true,
      persistent: true,
      ok: {
        label: "Delete",
        color: "negative",
        noCaps: true,
      },
      cancel: {
        label: "Cancel",
        color: "primary",
        noCaps: true,
      },
    })
      .onOk(() => {
        const index = entries.value.indexOf(entry);
        if (index > -1) {
          entries.value.splice(index, 1);
        } else {
          console.error("Entry not found in the list");
        }
      })
      .onCancel(() => {
        console.log("Cancel clicked");
      });
  } catch (error) {
    console.error("Error in onEntrySlideRight:", error.message);
  }
};
</script>
