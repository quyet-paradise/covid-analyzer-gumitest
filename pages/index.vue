<template>
  <v-row justify="center" align="center">
    <v-col cols="4" sm="4" md="3">
      <v-card
        outlined
        elevation="16"
        :loading="loading">
        <v-card-title class="text-caption text-md-h6 font-weight-medium">Confirmed cases</v-card-title>
        <v-card-subtitle class="text-caption text-md-body-2 red--text">{{ Intl.NumberFormat().format(globalData.TotalConfirmed) }}</v-card-subtitle>
        <v-card-text class="text-caption text-md-body-2 red--text">
          <v-icon color="red" small>mdi-arrow-up</v-icon>
          <span>{{ Intl.NumberFormat().format(globalData.NewConfirmed) }}</span>
          <span class="hidden-sm-and-down">&nbsp;today</span>
        </v-card-text>
      </v-card>
    </v-col>
     <v-col cols="4" sm="4" md="3">
      <v-card
        outlined
        elevation="16"
        :loading="loading">
        <v-card-title class="text-caption text-md-h6 font-weight-medium">Death cases</v-card-title>
        <v-card-subtitle class="text-caption text-md-body-2 gray--text">{{ Intl.NumberFormat().format(globalData.TotalDeaths) }}</v-card-subtitle>
        <v-card-text class="text-caption text-md-body-2 gray--text">
          <v-icon color="gray" small>mdi-arrow-up</v-icon>
          <span>{{ Intl.NumberFormat().format(globalData.NewDeaths) }}</span>
          <span class="hidden-sm-and-down">&nbsp;today</span>
        </v-card-text>
      </v-card>
    </v-col>
     <v-col cols="4" sm="4" md="3">
      <v-card
        outlined
        elevation="16"
        :loading="loading">
        <v-card-title class="text-caption text-md-h6 font-weight-medium">Recovered cases</v-card-title>
        <v-card-subtitle class="text-caption text-md-body-2 green--text">{{ Intl.NumberFormat().format(globalData.TotalRecovered) }}</v-card-subtitle>
        <v-card-text class="text-caption text-md-body-2 green--text">
          <v-icon color="green" small>mdi-arrow-up</v-icon>
          <span>{{ Intl.NumberFormat().format(globalData.NewRecovered) }}</span>
          <span class="hidden-sm-and-down">&nbsp;today</span>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12" sm="12" md="9" >
      <v-data-table
        dense
        :headers="headers"
        :items="countriesData"
        item-key="Country"
        class="elevation-1"
        :loading="loading"
        loading-text="Loading... Please wait"
        multi-sort
        :sort-by="['TotalConfirmed', 'TotalDeaths', 'TotalRecovered']"
        :sort-desc="[true, true, false]"
        @click:row="handleClickRow"
        style="cursor: pointer;"
      >
        <template v-slot:[`item.TotalConfirmed`]="{ item }">
          {{ Intl.NumberFormat().format(item.TotalConfirmed) }}
        </template>
        <template v-slot:[`item.TotalDeaths`]="{ item }">
          {{ Intl.NumberFormat().format(item.TotalDeaths) }}
        </template>
        <template v-slot:[`item.TotalRecovered`]="{ item }">
          {{ Intl.NumberFormat().format(item.TotalRecovered) }}
        </template>
      </v-data-table>
    </v-col>

    <v-col cols="12">
      <v-dialog
        scrollable
        transition="dialog-top-transition"
        max-width="600"
        v-model="dialog"
      >
        <template>
          <v-card v-if="!loadingDialog">
            <v-toolbar
              color="gray"
              dark
            >
              <v-spacer />
                <v-toolbar-title>
                  <img :src="countryData.flags.png" :alt="countryData.name.common" height="16" width="24">
                  <span>{{ countryData.name.common }}</span>
                </v-toolbar-title>
              <v-spacer />
            </v-toolbar>
            <v-card-text>
              <div class="text-subtitle-2 pt-2">Population:&nbsp;{{ Intl.NumberFormat().format(countryData.population) }}</div>
              <div class="text-subtitle-2">Capital:&nbsp;
                <span v-for="(item, idx) in countryData.capital" :key="idx">{{item}}.&nbsp;</span>
              </div>
              <div class="text-subtitle-2">Region:&nbsp;{{ countryData.region}}</div>
              <div class="text-subtitle-2">Subregion:&nbsp;{{ countryData.subregion}}</div>
              <v-row>
                <v-col v-if="hasDataChart" cols="12">
                  <line-chart
                    :chartData="dataSelectedCountry.chartdata"
                    :options="dataSelectedCountry.options"
                    style="height: 300px">
                  </line-chart>
                </v-col>
                <v-col v-if="!hasDataChart" cols="12">
                  <div class="text-h6">Failed to get data (error code: 400), please check another country</div>
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions class="justify-end">
              <v-btn
                text
                @click="dialog = false"
              >Close</v-btn>
            </v-card-actions>
          </v-card>

          <v-card
            color="gray"
            dark
            v-if="loadingDialog"
          >
            <v-card-text>
              Please stand by
              <v-progress-linear
                indeterminate
                color="white"
                class="mb-0"
              ></v-progress-linear>
            </v-card-text>
          </v-card>
        </template>
      </v-dialog>
    </v-col>
  </v-row>
</template>

<script>
import LineChart from "@/components/LineChart.vue";
export default {
  name: 'IndexPage',
  components: {
    LineChart
  },
  data() {
    return {
      headers: [
        {
          text: 'Country',
          sortable: false,
          value: 'Country',
        },
        { 
          text: 'Confirmed cases',
          value: 'TotalConfirmed'
        },
        { text: 'Death cases', value: 'TotalDeaths' },
        { text: 'Recovered cases', value: 'TotalRecovered' }
      ],
      globalData: {},
      countriesData: [],
      loading: false,
      hasDataChart: false,
      countryData: {
        name: {
          common: ''
        }, 
        flags: {
          png: ''
        },
        population: 0,
        capital: [],
        region: '',
        subregion: ''
      },
      covidData: [],
      dialog: false,
      loadingDialog: false,
      dataSelectedCountry: {
        chartdata: {
          labels: [],
          datasets: [
            {
              label: 'Confirmed cases',
              data: [],
              fill: false,
              borderColor: 'rgb(255, 0, 0)',
              tension: 0.1
            },
            {
              label: 'Death cases',
              data: [],
              fill: false,
              borderColor: 'rgb(0, 0, 0)',
              tension: 0.1
            },
            {
              label: 'Recovered cases',
              data: [],
              fill: false,
              borderColor: 'rgb(0, 255, 0)',
              tension: 0.1
            },
            {
              label: 'Active cases',
              data: [],
              fill: false,
              borderColor: 'rgb(255, 130, 0)',
              tension: 0.1
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      }
    }
  },
  async created() {
    this.loading = true;
    const response = await fetch("https://api.covid19api.com/summary");
    const data = await response.json();
    this.globalData = data.Global;
    this.countriesData = data.Countries;
    this.loading = false;
  },
  methods: {
    async handleClickRow(value) {
      this.dialog = true;
      this.loadingDialog = true;
      this.resetDataSelectedCountry();
      const countryDataResponse = await fetch("https://restcountries.com/v3.1/alpha/" + value.CountryCode);
      const covidDataResponse = await fetch("https://api.covid19api.com/country/" + value.Slug);
      const countryData = await countryDataResponse.json();
      const covidData = await covidDataResponse.json();
      this.countryData = countryData[0];

      let covidDataSize = covidData.length > 0 ? covidData.length : 0;
      this.covidData = covidDataSize > 0 ? covidData.slice(covidDataSize - 14) : [];
      this.hasDataChart = covidDataSize > 0 ? true : false;
      for(let i=0; i<this.covidData.length; i++) {
        this.dataSelectedCountry.chartdata.datasets[0].data.push(this.covidData[i].Confirmed);
        this.dataSelectedCountry.chartdata.datasets[1].data.push(this.covidData[i].Deaths);
        this.dataSelectedCountry.chartdata.datasets[2].data.push(this.covidData[i].Recovered);
        this.dataSelectedCountry.chartdata.datasets[3].data.push(this.covidData[i].Active);
        this.dataSelectedCountry.chartdata.labels.push(this.formatDate(new Date(this.covidData[i].Date)));
      }
      this.loadingDialog = false;
    },
    formatDate(datetime) {
      var day = ("0" + datetime.getDate()).slice(-2);
      var month = ("0" + (datetime.getMonth() + 1)).slice(-2);
  
      return day + "-" + month;
    },
    resetDataSelectedCountry() {
      this.dataSelectedCountry.chartdata.datasets[0].data = [];
      this.dataSelectedCountry.chartdata.datasets[1].data = [];
      this.dataSelectedCountry.chartdata.datasets[2].data = [];
      this.dataSelectedCountry.chartdata.datasets[3].data = [];
      this.dataSelectedCountry.chartdata.labels = [];
    }
  }
}
</script>