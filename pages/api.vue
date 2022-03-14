<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="12" md="8">
      <v-expansion-panels>
        <v-expansion-panel>
          <v-expansion-panel-header>
            Covid-19 API
            <template v-slot:actions>
              <v-icon color="primary">
                $expand
              </v-icon>
            </template>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <a href="https://api.covid19api.com/">https://api.covid19api.com/</a>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel>
          <v-expansion-panel-header>
            REST Countries API
            <template v-slot:actions>
              <v-icon color="primary">
                $expand
              </v-icon>
            </template>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <a href="https://restcountries.com/">https://restcountries.com/</a>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'APIPage'
}
</script>
