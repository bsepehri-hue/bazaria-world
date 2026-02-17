import { PetsForm, PetsDetails, PetsSpecs } from "./pets";
// Future categories:
import { CarsForm, CarsDetails, CarsSpecs } from "./cars";
// import { HomesForm, HomesDetails, HomesSpecs } from "./homes";
// ...and so on

export function loadCategoryConfig(category: string) {
  switch (category) {
    case "pets":
      return {
        form: PetsForm,
        details: PetsDetails,
        specs: PetsSpecs,
      };

    // Example future categories:
    case "cars":
  return {
    form: CarsForm,
    details: CarsDetails,
    specs: CarsSpecs,
  };

    // case "homes":
    //   return {
    //     form: HomesForm,
    //     details: HomesDetails,
    //     specs: HomesSpecs,
    //   };

    default:
      return null; // category not recognized
  }
}
