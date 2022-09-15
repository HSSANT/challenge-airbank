<script lang="ts">
/**
 * Main table component
 */
import moment from "moment";
export default {
  props: ["transactions", "loading"],
  data() {
    return {
      tableData: (this as any).transactions,

      title: "Transactions",
      items: [
        {
          text: "Airbank",
        },
        {
          text: "Reports",
          active: true,
        },
      ],
      totalRows: 1,
      currentPage: 1,
      perPage: 10,
      pageOptions: [10, 25, 50, 100],
      filter: null,
      filterOn: [],
      sortBy: "date",
      sortDesc: false,
      fields: [
        {
          key: "account.name",
          label: "Account",
          sortable: true,
        },
        {
          key: "account.name",
          label: "Bank",
          sortable: true,
        },
        {
          key: "reference",
          label: "Reference",
          sortable: true,
        },
        {
          key: "category",
          label: "Category",
          sortable: true,
        },
        {
          key: "date",
          label: "Date",
          sortable: true,
        },
        {
          key: "amount",
          label: "Amount",
          sortable: true,
        },
      ],
    };
  },
  computed: {
    /**
     * Total no. of records
     */
    rows() {
      return (this as any).transactions.length;
    },
  },
  mounted() {
    // Set the initial number of items
    (this as any).totalRows = (this as any).items.length;
  },
  methods: {
    /**
     * Search the table data with search input
     */
    onFiltered(filteredItems: any) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      (this as any).totalRows = filteredItems.length;
      (this as any).currentPage = 1;
    },
    formatDate(data: any) {
      return moment(data).format("DD/MM/YY");
    },
    onRowSelected(items) {
      (this as any).$router.push(`/transactions/${items[0].id}`);
      (this as any).$refs.selectableTable.clearSelected();
    },
    toCurrency(value: number, currency: string) {
      let locale = "";
      switch (currency) {
        case "GBP":
          locale = "en-GB";
        case "EUR":
          locale = "de-DE";
        case "USD":
          locale = "en-US";
        default:
          locale = "de-DE";
      }
      var formatter = new Intl.NumberFormat(locale, {
        style: "currency",
        currency: currency,
      });
      return formatter.format(value);
    },
    isTooDark(hexcolor: string) {
      var r = parseInt(hexcolor.substr(1, 2), 16);
      var g = parseInt(hexcolor.substr(3, 2), 16);
      var b = parseInt(hexcolor.substr(4, 2), 16);
      var yiq = (r * 299 + g * 587 + b * 114) / 1000;
      return yiq < 92 ? true : false;
    },
    renderCategory(transaction: any) {
      if (transaction.category) {
        return `
            <span
              class="inline-block py-2 px-4 rounded-md font-medium"
              style="color:${
                this.isTooDark(
                  transaction.category.color
                    ? "#" + transaction.category.color
                    : "#dfdfdf"
                )
                  ? "white"
                  : ""
              };background-color: #${
          transaction.category.color ? transaction.category.color : "dfdfdf"
        }"
              > 
              ${transaction.category.name}
            </span>`;
      } else {
        return ``;
      }
    },
  },
};
</script>

<template>
  <div>
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <!-- Table -->
            <div class="table-responsive mb-0">
              <b-table
                hover
                :busy="loading"
                :items="tableData"
                :fields="fields"
                responsive
                :per-page="perPage"
                :current-page="currentPage"
                :sort-by.sync="sortBy"
                :sort-desc.sync="sortDesc"
                :filter="filter"
                :filter-included-fields="filterOn"
                @filtered="onFiltered"
                selectable
                @row-selected="onRowSelected"
                ref="selectableTable"
              >
                <template #table-busy>
                  <div class="text-center text-black my-2">
                    <b-spinner class="align-middle"></b-spinner>
                    <strong>Loading...</strong>
                  </div>
                </template>
                <template #cell(category)="row">
                  <div v-html="renderCategory(row.item)" />
                </template>
                <template #cell(date)="row">
                  {{ formatDate(row.item.date) }}
                </template>
                <template #cell(amount)="row">
                  {{ toCurrency(row.item.amount, row.item.currency) }}
                </template>
              </b-table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
