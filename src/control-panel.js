import React, { PureComponent } from 'react';
import { DropdownButton, MenuItem, Checkbox } from 'react-bootstrap';
import Select from 'react-select';


const defaultContainer = ({ children }) => <div className="control-panel">{children}</div>;

const optionsAge = [
  { value: 'PENSION_AGE_POPULATION', label: 'Pension age population' },
  { value: 'WORKING_AGE_POPULATION', label: 'Working-age population' },
  { value: null, label: 'Population (0-15 years)' }
];

const optionsSex = [
  { value: 'FEMALES', label: 'Females' },
  { value: 'MALES', label: 'Males' }
];

const optionsYears = [
  { value: 2015, label: '2015' },
  { value: 2014, label: '2014' }
];

const optionsEconomic = [
  { value: 'RESTAURANTS_AND_MOBILE_FOOD_SERVICE_ACTIVITIES', label: 'Restaurants and mobile food service activities' },
  { value: 'MANUFACTURE_OF_RUSKS_AND_BISCUITS_MANUFACTURE_OF_PRESERVED_PASTRY_GOODS_AND_CAKES', label: 'Manufacture of rusks and biscuits, Manufacture of preserved pastry goods and cakes' },
  { value: 'OTHER_FOOD_SERVICE_ACTIVITIES', label: 'Other food services activities' },
  { value: 'RETAIL_SALE_VIA_STALLS_AND_MARKETS_OF_FOOD_BEVERAGES_AND_TOBACCO_PRODUCTS', label: 'Retail sale via stalls and markets of food beverages and tobacco products' },
  { value: 'RETAIL_SALE_OF_BREAD_CAKES_FLOUR_CONFECTIONERY_AND_SUGAR_CONFECTIONERY_IN_SPECIALISED_STORES', label: 'Retail of bread cakes flour confectionery and sugar confectioner in specialised stores' },
  { value: 'PACKAGING_ACTIVITIES', label: 'Packaging activities' },
  { value: 'BEVERAGE_SERVING_ACTIVITIES', label: 'Beverage serving activities' },
  { value: 'RETAIL_SALE_IN_NON_SPECIALISED_STORES_WITH_FOOD_BEVERAGES_OR_TOBACCO_PREDOMINATING', label: 'Retail sale in non specialised stores with food beverage or tobacco predominating' },
]

const optionsEmployees = [
  { value: 'A_0_4_EMPLOYEES', label: '0-4 employees' },
  { value: 'A_1_000_AND_MORE_EMPLOYEES', label: '1000 and more employees' },
  { value: 'A_10_19_EMPLOYEES', label: '10-19 employees ' },
  { value: 'A_100_149_EMPLOYEES', label: '100-149 employees' },
  { value: 'A_150_249_EMPLOYEES', label: '150-249 employees' },
  { value: 'A_20_49_EMPLOYEES', label: '20-49 employees' },
  { value: 'A_250_499_EMPLOYEES', label: '250-499 eployees' },
  { value: 'A_5_9_EMPLOYEES', label: '5-9 employees' },
  { value: 'A_50_99_EMPLOYEES', label: '50-99 employees' },
  { value: 'A_500_999_EMPLOYEES', label: '500-999 employees' }
]

export default class ControlPanel extends PureComponent {
  render() {
    const Container = this.props.containerComponent || defaultContainer;
    const { settings } = this.props;
    const menu = settings.datasetsOptions.map(option => {
      if (option.value === settings.datasetSelected) {
        return (
          <MenuItem eventKey={option.value} active>{option.label}</MenuItem>
        )
      }
      if (!option.value) { //this means is a divider
        return <MenuItem divider />;
      }
      return (
        <MenuItem eventKey={option.value}>{option.label}</MenuItem>
      );

    })

    let extra_component = null;

    switch (settings.datasetSelected) {
      case 'residents':
        extra_component = (
          <div>
            Filter Population <br />
            Age
            <Select
              defaultValue={optionsAge[0]}
              onChange={(e) => {
                let aux = e.map(opt => opt.value);
                this.props.updateState(
                  {
                    filters: {
                      residents: {
                        age: aux,
                        gender: settings.filters.residents.gender
                      },
                      food_and_vet: {
                        economic: this.props.settings.filters.food_and_vet.economic,
                        heatmap: this.props.settings.filters.food_and_vet.heatmap
                      },
                      foreign_investment: {
                        year: this.props.settings.filters.foreign_investment.year
                      },
                      economic_entities: {
                        employee: this.props.settings.filters.economic_entities.employee
                      },
                      fixed_assets: {
                        year: this.props.settings.filters.fixed_assets.year
                      }
                    }
                  }
                )
              }}
              options={optionsAge}
              isMulti
            />
            Gender
            <Select
              defaultValue={optionsSex[0]}
              onChange={(e) => {
                let aux = e.map(opt => opt.value);
                this.props.updateState(
                  {
                    filters: {
                      residents: {
                        age: settings.filters.residents.age,
                        gender: aux
                      },
                      food_and_vet: {
                        economic: this.props.settings.filters.food_and_vet.economic,
                        heatmap: this.props.settings.filters.food_and_vet.heatmap
                      },
                      foreign_investment: {
                        year: this.props.settings.filters.foreign_investment.year
                      },
                      economic_entities: {
                        employee: this.props.settings.filters.economic_entities.employee
                      },
                      fixed_assets: {
                        year: this.props.settings.filters.fixed_assets.year
                      }
                    }
                  }
                )
              }}
              options={optionsSex}
              isMulti
            />
          </div>
        );
        break;
      case 'investment':
        extra_component = (
          <div>
            Select Year
          </div>
        );
        break;
      case 'foreign_investment':
        extra_component = (
          <div>
            <Select
              defaultValue={optionsYears[0]}
              onChange={(e) => {
                let aux = e.value;
                this.props.updateState(
                  {
                    filters: {
                      residents: {
                        age: settings.filters.residents.age,
                        gender: settings.filters.residents.gender
                      },
                      food_and_vet: {
                        economic: this.props.settings.filters.food_and_vet.economic,
                        heatmap: this.props.settings.filters.food_and_vet.heatmap
                      },
                      foreign_investment: {
                        year: aux
                      },
                      economic_entities: {
                        employee: this.props.settings.filters.economic_entities.employee
                      },
                      fixed_assets: {
                        year: this.props.settings.filters.fixed_assets.year
                      }

                    }
                  }
                )
              }}
              options={optionsYears}
            />
          </div>
        );
        break;
      case 'food_and_vet':
        extra_component = (
          <div>
             Select Economic Activity
            <Select
              defaultValue={optionsEconomic[0]}
              onChange={(e) => {
                let aux = e.map(opt => opt.value);
                this.props.updateState(
                  {
                    filters: {
                      residents: {
                        age: settings.filters.residents.age,
                        gender: settings.filters.residents.gender
                      },
                      food_and_vet: {
                        economic: aux,
                        heatmap: this.props.settings.filters.food_and_vet.heatmap
                      },
                      foreign_investment: {
                        year: this.props.settings.filters.foreign_investment.year
                      },
                      economic_entities: {
                        employee: this.props.settings.filters.economic_entities.employee
                      },
                      fixed_assets: {
                        year: this.props.settings.filters.fixed_assets.year
                      }
                    }
                  }
                )
              }}
              options={optionsEconomic}
              isMulti
            />
            <br />
            <label id="myLabel" htmlFor="myLabel">Heatmap</label>
            <input id="myLabel" checked={this.props.settings.filters.food_and_vet.heatmap} type="checkbox" onChange={() => this.props.updateState({
              filters: {
                residents: {
                  age: settings.filters.residents.age,
                  gender: settings.filters.residents.gender
                },
                food_and_vet: {
                  economic: this.props.settings.filters.food_and_vet.economic,
                  heatmap: !this.props.settings.filters.food_and_vet.heatmap
                },
                foreign_investment: {
                  year: this.props.settings.filters.foreign_investment.year
                },
                economic_entities: {
                  employee: this.props.settings.filters.economic_entities.employee
                },
                fixed_assets: {
                  year: this.props.settings.filters.fixed_assets.year
                }
              }
            })} />

          </div>
        );
        break;

      case 'economic_entities':
        extra_component = (
          <div>
            <Select
              defaultValue={optionsEmployees[0]}
              onChange={(e) => {
                let aux = e.map(opt => opt.value);
                this.props.updateState(
                  {
                    filters: {
                      residents: {
                        age: settings.filters.residents.age,
                        gender: settings.filters.residents.gender
                      },
                      food_and_vet: {
                        economic: this.props.settings.filters.food_and_vet.aux,
                        heatmap: this.props.settings.filters.food_and_vet.heatmap
                      },
                      foreign_investment: {
                        year: this.props.settings.filters.foreign_investment.year
                      },
                      economic_entities: {
                        employee: aux
                      },
                      fixed_assets: {
                        year: this.props.settings.filters.fixed_assets.year
                      }
                    }
                  }
                )
              }}
              options={optionsEmployees}
              isMulti
            />

          </div>
        );
        break;

      case 'investment_tangible':
        extra_component = (
          <div>
            <Select
              defaultValue={[{ value: 'A_2015', label: '2015' }]}
              onChange={(e) => {
                let aux = e.map(opt => opt.value);
                this.props.updateState(
                  {
                    filters: {
                      residents: {
                        age: settings.filters.residents.age,
                        gender: settings.filters.residents.gender
                      },
                      food_and_vet: {
                        economic: this.props.settings.filters.food_and_vet.aux,
                        heatmap: this.props.settings.filters.food_and_vet.heatmap
                      },
                      foreign_investment: {
                        year: this.props.settings.filters.foreign_investment.year
                      },
                      economic_entities: {
                        employee: this.props.settings.filters.economic_entities.employee
                      },
                      fixed_assets: {
                        year: aux
                      }
                    }
                  }
                )
              }}
              options={ [{ value: 'A_2015', label: '2015' }]}
            />

          </div>
        );
        break;
    }


    return (
      <Container>
        <h3>Lithuanian Pilot</h3>
        <p><strong>Open Government Intelligence</strong></p>
        <p> Select one or more datasets</p>
        <DropdownButton
          bsStyle={'primary'}
          title={'Datasets Availabe'}
          key={'datasetlist_key'}
          id={`1`}
          active={settings.datasetSelected}
          onSelect={e => { this.props.updateState({ datasetSelected: e }) }}
        >
          {menu}
        </DropdownButton>

        <hr />

        {extra_component}
      </Container>
    );
  }
}
