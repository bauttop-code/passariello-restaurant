/**
 * Selection Lookup Registration Helper
 * Contains all registerOptionsToLookup calls to build the complete canonical lookup
 * This ensures ZERO warnings by registering every single options array
 */

import { SelectionLookup, registerOptionsToLookup } from './selectionsRegistry';

/**
 * Registers ALL missing arrays that were not in the initial setup
 * Call this AFTER registering the base arrays
 */
export const registerMissingArrays = (
  selectionLookup: SelectionLookup,
  arrays: {
    // Pizza extras
    specialtyToppingsSecondHalf?: any[];
    extraToppings?: any[];
    liteToppings?: any[];
    specialInstructionsBrooklyn?: any[];
    specialInstructionsOptions?: any[];
    pizzaDippingsOptions?: any[];
    
    // Cheesesteak
    cheesesteakToppings?: any[];
    createYourOwnCheesesteakToppings?: any[];
    cheesesteakNoToppings?: any[];
    cheesesteakSideToppingsRequired?: any[];
    
    // Burgers
    burgerLiteToppings?: any[];
    burgerSubstituteCheese?: any[];
    
    // Brioche
    briocheNoToppings?: any[];
    briocheGrilledChickenNoToppings?: any[];
    briocheMozzarellaGrilledChickenNoToppings?: any[];
    briocheSideToppings?: any[];
    briocheAddCheese?: any[];
    briocheExtraCheese?: any[];
    
    // Hot Hoagies
    hotHoagieSides?: any[];
    hotHoagieSpecialInstructions?: any[];
    hotHoagieExtraSides?: any[];
    hotHoagieSubstituteCheese?: any[];
    grilledChickenHoagieNoToppings?: any[];
    sausagePeppersOnionsNoToppings?: any[];
    cheeseBurgerDeluxeNoToppings?: any[];
    
    // Cold Hoagies
    coldHoagieExtraToppings?: any[];
    coldHoagieLiteToppings?: any[];
    coldHoagieNoToppings?: any[];
    coldHoagieSideToppings?: any[];
    coldHoagieAddCheese?: any[];
    coldHoagieSideToppingsRequired?: any[];
    coldHoagieSideOfChips?: any[];
    
    // Paninis
    paniniNoToppings?: any[];
    paniniSideToppings?: any[];
    paniniChooseType?: any[];
    paniniExtraCheese?: any[];
    paniniSubstituteCheese?: any[];
    
    // Wraps
    wrapLiteToppings?: any[];
    wrapNoToppings?: any[];
    wrapSideToppings?: any[];
    wrapSubstituteCheese?: any[];
    cheesesteakWrapLiteToppings?: any[];
    cheesesteakWrapNoToppings?: any[];
    grilledChickenWrapLiteToppings?: any[];
    grilledChickenWrapNoToppings?: any[];
    italianWrapLiteToppings?: any[];
    italianWrapNoToppings?: any[];
    
    // Pasta
    pastaVegetables?: any[];
    pastaProteins?: any[];
    pastaCheesesExtras?: any[];
    pastaAdditions?: any[];
    buildPastaSauces?: any[];
    buildPastaToppings?: any[];
    buildPastaSoups?: any[];
    
    // Seafood
    seafoodPastaTypes?: any[];
    babyClamPastaTypes?: any[];
    babyClamSauceChoices?: any[];
    calamariPastaTypes?: any[];
    calamariSubstituteSauce?: any[];
    calamariSubSauceOptions?: any[]; // ADDED
    musselsPastaTypes?: any[];
    musselsSauceChoices?: any[];
    musselsSauceOptions?: any[]; // ADDED
    seafoodComboPastaTypes?: any[];
    seafoodComboSauceChoices?: any[];
    seafoodComboSauceOptions?: any[]; // ADDED
    shrimpMarinaraPastaTypes?: any[];
    shrimpMarinaraSubstituteSauce?: any[];
    marinaraAppetizerSauceOptions?: any[]; // ADDED
    
    // Salads
    saladToppingsOptions?: any[];
    antipastoSaladBases?: any[];
    antipastoSaladDressings?: any[];
    antipastoSaladSpecialInstructions?: any[];
    caesarSaladSpecialInstructions?: any[];
    calamariSaladSpecialInstructions?: any[];
    capreseSaladSpecialInstructions?: any[];
    farfallePastaSaladSpecialInstructions?: any[];
    gardenSaladSpecialInstructions?: any[];
    italianChoppedSpecialInstructions?: any[];
    roastedRedPeppersSaladSpecialInstructions?: any[];
    traditionalChefSaladSpecialInstructions?: any[];
    tunaSaladSpecialInstructions?: any[];
    threeCheeseSaladSpecialInstructions?: any[];
    
    // Kids
    kidsPastaToppings?: any[];
    kidsPastaSpecialInstructions?: any[];
    kidsBakedExtraToppings?: any[];
    kidsBakedLiteToppings?: any[];
    kidsBakedNoToppings?: any[];
    kidsPastaMeatballToppings?: any[];
    kidsPastaMeatballSpecialInstructions?: any[];
    
    // Sides
    mashedPotatoesToppings?: any[];
    meatballsSausageSauceToppings?: any[];
    pastaFagioliSubstituteCracker?: any[];
    pastaFagioliSubstituteOptions?: any[];
    
    // Appetizers
    wingsSpecialInstructionsOptions?: any[];
    wingsExtraSauceOptions?: any[];
    wingsExtraCheeseRanchOptions?: any[];
    chickenTendersExtraSauceOptions?: any[];
    mozzarellaSticksExtraSauceOptions?: any[];
    mozzarellaSticksSpecialInstructionsOptions?: any[];
    aranciniSpecialInstructionsOptions?: any[];
    
    // Platters
    hoagiePlatterOptions?: any[];
    hoagiePlatterCutOptions?: any[];
    hoagiePlatterSideToppings?: any[];
    wrapPlatterOptions?: any[];
    wrapPlatterWrapTypes?: any[];
    wrapPlatterSideToppings?: any[];
    hotSandwichPlatterOptions?: any[];
    hotSandwichPlatterCutOptions?: any[];
    hotSandwichPlatterSideToppings?: any[];
    
    // Desserts
    cannoliSpecialInstruction?: any[];
    dessertTraySpecialInstruction?: any[];
  }
) => {
  // Pizza extras
  if (arrays.specialtyToppingsSecondHalf) registerOptionsToLookup(selectionLookup, arrays.specialtyToppingsSecondHalf, { groupId: 'specialty_toppings_2nd', groupTitle: 'Specialty Toppings (2nd Half)', type: 'topping' });
  if (arrays.extraToppings) registerOptionsToLookup(selectionLookup, arrays.extraToppings, { groupId: 'extra_toppings', groupTitle: 'Extra Toppings', type: 'extra_topping' });
  if (arrays.liteToppings) registerOptionsToLookup(selectionLookup, arrays.liteToppings, { groupId: 'lite_toppings', groupTitle: 'Lite Toppings', type: 'topping' });
  if (arrays.specialInstructionsBrooklyn) registerOptionsToLookup(selectionLookup, arrays.specialInstructionsBrooklyn, { groupId: 'brooklyn_instructions', groupTitle: 'Special Instructions', type: 'special_instruction' });
  if (arrays.specialInstructionsOptions) registerOptionsToLookup(selectionLookup, arrays.specialInstructionsOptions, { groupId: 'special_instructions', groupTitle: 'Special Instructions', type: 'special_instruction' });
  if (arrays.pizzaDippingsOptions) registerOptionsToLookup(selectionLookup, arrays.pizzaDippingsOptions, { groupId: 'pizza_dippings', groupTitle: 'Pizza Dippings', type: 'extra_topping' });
  
  // Cheesesteak
  if (arrays.cheesesteakToppings) registerOptionsToLookup(selectionLookup, arrays.cheesesteakToppings, { groupId: 'cheesesteak_toppings', groupTitle: 'Toppings', type: 'topping' });
  if (arrays.createYourOwnCheesesteakToppings) registerOptionsToLookup(selectionLookup, arrays.createYourOwnCheesesteakToppings, { groupId: 'create_cheesesteak', groupTitle: 'Toppings', type: 'topping' });
  if (arrays.cheesesteakNoToppings) registerOptionsToLookup(selectionLookup, arrays.cheesesteakNoToppings, { groupId: 'cheesesteak_no', groupTitle: 'No Toppings', type: 'no_topping' });
  if (arrays.cheesesteakSideToppingsRequired) registerOptionsToLookup(selectionLookup, arrays.cheesesteakSideToppingsRequired, { groupId: 'cheesesteak_side', groupTitle: 'Side Toppings', type: 'side' });
  
  // Burgers
  if (arrays.burgerLiteToppings) registerOptionsToLookup(selectionLookup, arrays.burgerLiteToppings, { groupId: 'burger_lite', groupTitle: 'Lite Toppings', type: 'topping' });
  if (arrays.burgerSubstituteCheese) registerOptionsToLookup(selectionLookup, arrays.burgerSubstituteCheese, { groupId: 'burger_cheese', groupTitle: 'Substitute Cheese', type: 'cheese' });
  
  // Brioche
  if (arrays.briocheNoToppings) registerOptionsToLookup(selectionLookup, arrays.briocheNoToppings, { groupId: 'brioche_no', groupTitle: 'No Toppings', type: 'no_topping' });
  if (arrays.briocheGrilledChickenNoToppings) registerOptionsToLookup(selectionLookup, arrays.briocheGrilledChickenNoToppings, { groupId: 'brioche_gc_no', groupTitle: 'No Toppings', type: 'no_topping' });
  if (arrays.briocheMozzarellaGrilledChickenNoToppings) registerOptionsToLookup(selectionLookup, arrays.briocheMozzarellaGrilledChickenNoToppings, { groupId: 'brioche_mgc_no', groupTitle: 'No Toppings', type: 'no_topping' });
  if (arrays.briocheSideToppings) registerOptionsToLookup(selectionLookup, arrays.briocheSideToppings, { groupId: 'brioche_side', groupTitle: 'Side Toppings', type: 'side' });
  if (arrays.briocheAddCheese) registerOptionsToLookup(selectionLookup, arrays.briocheAddCheese, { groupId: 'brioche_add_cheese', groupTitle: 'Add Cheese', type: 'cheese' });
  if (arrays.briocheExtraCheese) registerOptionsToLookup(selectionLookup, arrays.briocheExtraCheese, { groupId: 'brioche_extra_cheese', groupTitle: 'Extra Cheese', type: 'extra_topping' });
  
  // Hot Hoagies
  if (arrays.hotHoagieSides) registerOptionsToLookup(selectionLookup, arrays.hotHoagieSides, { groupId: 'hot_hoagie_sides', groupTitle: 'Sides', type: 'side' });
  if (arrays.hotHoagieSpecialInstructions) registerOptionsToLookup(selectionLookup, arrays.hotHoagieSpecialInstructions, { groupId: 'hot_hoagie_instructions', groupTitle: 'Special Instructions', type: 'special_instruction' });
  if (arrays.hotHoagieExtraSides) registerOptionsToLookup(selectionLookup, arrays.hotHoagieExtraSides, { groupId: 'hot_hoagie_extra_sides', groupTitle: 'Extra Sides', type: 'side' });
  if (arrays.hotHoagieSubstituteCheese) registerOptionsToLookup(selectionLookup, arrays.hotHoagieSubstituteCheese, { groupId: 'hot_hoagie_cheese', groupTitle: 'Substitute Cheese', type: 'cheese' });
  if (arrays.grilledChickenHoagieNoToppings) registerOptionsToLookup(selectionLookup, arrays.grilledChickenHoagieNoToppings, { groupId: 'gc_hoagie_no', groupTitle: 'No Toppings', type: 'no_topping' });
  if (arrays.sausagePeppersOnionsNoToppings) registerOptionsToLookup(selectionLookup, arrays.sausagePeppersOnionsNoToppings, { groupId: 'sausage_peppers_no', groupTitle: 'No Toppings', type: 'no_topping' });
  if (arrays.cheeseBurgerDeluxeNoToppings) registerOptionsToLookup(selectionLookup, arrays.cheeseBurgerDeluxeNoToppings, { groupId: 'cbd_no', groupTitle: 'No Toppings', type: 'no_topping' });
  
  // Cold Hoagies
  if (arrays.coldHoagieExtraToppings) registerOptionsToLookup(selectionLookup, arrays.coldHoagieExtraToppings, { groupId: 'cold_hoagie_extra', groupTitle: 'Extra Toppings', type: 'extra_topping' });
  if (arrays.coldHoagieLiteToppings) registerOptionsToLookup(selectionLookup, arrays.coldHoagieLiteToppings, { groupId: 'cold_hoagie_lite', groupTitle: 'Lite Toppings', type: 'topping' });
  if (arrays.coldHoagieNoToppings) registerOptionsToLookup(selectionLookup, arrays.coldHoagieNoToppings, { groupId: 'cold_hoagie_no', groupTitle: 'No Toppings', type: 'no_topping' });
  if (arrays.coldHoagieSideToppings) registerOptionsToLookup(selectionLookup, arrays.coldHoagieSideToppings, { groupId: 'cold_hoagie_side', groupTitle: 'Side Toppings', type: 'side' });
  if (arrays.coldHoagieAddCheese) registerOptionsToLookup(selectionLookup, arrays.coldHoagieAddCheese, { groupId: 'cold_hoagie_cheese', groupTitle: 'Add Cheese', type: 'cheese' });
  if (arrays.coldHoagieSideToppingsRequired) registerOptionsToLookup(selectionLookup, arrays.coldHoagieSideToppingsRequired, { groupId: 'cold_hoagie_side_req', groupTitle: 'Side Toppings (Required)', type: 'side' });
  if (arrays.coldHoagieSideOfChips) registerOptionsToLookup(selectionLookup, arrays.coldHoagieSideOfChips, { groupId: 'cold_hoagie_chips', groupTitle: 'Side of Chips', type: 'side' });
  
  // Paninis
  if (arrays.paniniNoToppings) registerOptionsToLookup(selectionLookup, arrays.paniniNoToppings, { groupId: 'panini_no', groupTitle: 'No Toppings', type: 'no_topping' });
  if (arrays.paniniSideToppings) registerOptionsToLookup(selectionLookup, arrays.paniniSideToppings, { groupId: 'panini_side', groupTitle: 'Side Toppings', type: 'side' });
  if (arrays.paniniChooseType) registerOptionsToLookup(selectionLookup, arrays.paniniChooseType, { groupId: 'panini_type', groupTitle: 'Panini Type', type: 'required_option' });
  if (arrays.paniniExtraCheese) registerOptionsToLookup(selectionLookup, arrays.paniniExtraCheese, { groupId: 'panini_extra_cheese', groupTitle: 'Extra Cheese', type: 'extra_topping' });
  if (arrays.paniniSubstituteCheese) registerOptionsToLookup(selectionLookup, arrays.paniniSubstituteCheese, { groupId: 'panini_cheese', groupTitle: 'Substitute Cheese', type: 'cheese' });
  
  // Wraps
  if (arrays.wrapLiteToppings) registerOptionsToLookup(selectionLookup, arrays.wrapLiteToppings, { groupId: 'wrap_lite', groupTitle: 'Lite Toppings', type: 'topping' });
  if (arrays.wrapNoToppings) registerOptionsToLookup(selectionLookup, arrays.wrapNoToppings, { groupId: 'wrap_no', groupTitle: 'No Toppings', type: 'no_topping' });
  if (arrays.wrapSideToppings) registerOptionsToLookup(selectionLookup, arrays.wrapSideToppings, { groupId: 'wrap_side', groupTitle: 'Side Toppings', type: 'side' });
  if (arrays.wrapSubstituteCheese) registerOptionsToLookup(selectionLookup, arrays.wrapSubstituteCheese, { groupId: 'wrap_cheese', groupTitle: 'Substitute Cheese', type: 'cheese' });
  if (arrays.cheesesteakWrapLiteToppings) registerOptionsToLookup(selectionLookup, arrays.cheesesteakWrapLiteToppings, { groupId: 'cs_wrap_lite', groupTitle: 'Lite Toppings', type: 'topping' });
  if (arrays.cheesesteakWrapNoToppings) registerOptionsToLookup(selectionLookup, arrays.cheesesteakWrapNoToppings, { groupId: 'cs_wrap_no', groupTitle: 'No Toppings', type: 'no_topping' });
  if (arrays.grilledChickenWrapLiteToppings) registerOptionsToLookup(selectionLookup, arrays.grilledChickenWrapLiteToppings, { groupId: 'gc_wrap_lite', groupTitle: 'Lite Toppings', type: 'topping' });
  if (arrays.grilledChickenWrapNoToppings) registerOptionsToLookup(selectionLookup, arrays.grilledChickenWrapNoToppings, { groupId: 'gc_wrap_no', groupTitle: 'No Toppings', type: 'no_topping' });
  if (arrays.italianWrapLiteToppings) registerOptionsToLookup(selectionLookup, arrays.italianWrapLiteToppings, { groupId: 'italian_wrap_lite', groupTitle: 'Lite Toppings', type: 'topping' });
  if (arrays.italianWrapNoToppings) registerOptionsToLookup(selectionLookup, arrays.italianWrapNoToppings, { groupId: 'italian_wrap_no', groupTitle: 'No Toppings', type: 'no_topping' });
  
  // Pasta
  if (arrays.pastaVegetables) registerOptionsToLookup(selectionLookup, arrays.pastaVegetables, { groupId: 'pasta_vegetables', groupTitle: 'Vegetables', type: 'topping' });
  if (arrays.pastaProteins) registerOptionsToLookup(selectionLookup, arrays.pastaProteins, { groupId: 'pasta_proteins', groupTitle: 'Proteins', type: 'topping' });
  if (arrays.pastaCheesesExtras) registerOptionsToLookup(selectionLookup, arrays.pastaCheesesExtras, { groupId: 'pasta_cheeses', groupTitle: 'Cheeses & Extras', type: 'extra_topping' });
  if (arrays.pastaAdditions) registerOptionsToLookup(selectionLookup, arrays.pastaAdditions, { groupId: 'pasta_additions', groupTitle: 'Additions', type: 'topping' });
  if (arrays.buildPastaSauces) registerOptionsToLookup(selectionLookup, arrays.buildPastaSauces, { groupId: 'build_pasta_sauces', groupTitle: 'Choose a Sauce', type: 'sauce' });
  if (arrays.buildPastaToppings) registerOptionsToLookup(selectionLookup, arrays.buildPastaToppings, { groupId: 'build_pasta_toppings', groupTitle: 'Toppings', type: 'topping' });
  if (arrays.buildPastaSoups) registerOptionsToLookup(selectionLookup, arrays.buildPastaSoups, { groupId: 'build_pasta_soups', groupTitle: 'Soups', type: 'side' });
  
  // Seafood
  if (arrays.seafoodPastaTypes) registerOptionsToLookup(selectionLookup, arrays.seafoodPastaTypes, { groupId: 'seafood_pasta', groupTitle: 'Pasta Type', type: 'pasta_type' });
  if (arrays.babyClamPastaTypes) registerOptionsToLookup(selectionLookup, arrays.babyClamPastaTypes, { groupId: 'baby_clam_pasta', groupTitle: 'Pasta Type', type: 'pasta_type' });
  if (arrays.babyClamSauceChoices) registerOptionsToLookup(selectionLookup, arrays.babyClamSauceChoices, { groupId: 'baby_clam_sauce', groupTitle: 'Sauce Choice', type: 'sauce' });
  if (arrays.calamariPastaTypes) registerOptionsToLookup(selectionLookup, arrays.calamariPastaTypes, { groupId: 'calamari_pasta', groupTitle: 'Pasta Type', type: 'pasta_type' });
  if (arrays.calamariSubstituteSauce) registerOptionsToLookup(selectionLookup, arrays.calamariSubstituteSauce, { groupId: 'calamari_sauce', groupTitle: 'Sauce Choice', type: 'sauce' });
  if (arrays.calamariSubSauceOptions) registerOptionsToLookup(selectionLookup, arrays.calamariSubSauceOptions, { groupId: 'calamari_sub_sauce', groupTitle: 'Sauce Choice', type: 'sauce' });
  if (arrays.musselsPastaTypes) registerOptionsToLookup(selectionLookup, arrays.musselsPastaTypes, { groupId: 'mussels_pasta', groupTitle: 'Pasta Type', type: 'pasta_type' });
  if (arrays.musselsSauceChoices) registerOptionsToLookup(selectionLookup, arrays.musselsSauceChoices, { groupId: 'mussels_sauce', groupTitle: 'Sauce Choice', type: 'sauce' });
  if (arrays.musselsSauceOptions) registerOptionsToLookup(selectionLookup, arrays.musselsSauceOptions, { groupId: 'mussels_sauce_options', groupTitle: 'Sauce Choice', type: 'sauce' });
  if (arrays.seafoodComboPastaTypes) registerOptionsToLookup(selectionLookup, arrays.seafoodComboPastaTypes, { groupId: 'seafood_combo_pasta', groupTitle: 'Pasta Type', type: 'pasta_type' });
  if (arrays.seafoodComboSauceChoices) registerOptionsToLookup(selectionLookup, arrays.seafoodComboSauceChoices, { groupId: 'seafood_combo_sauce', groupTitle: 'Sauce Choice', type: 'sauce' });
  if (arrays.seafoodComboSauceOptions) registerOptionsToLookup(selectionLookup, arrays.seafoodComboSauceOptions, { groupId: 'seafood_combo_sauce_options', groupTitle: 'Sauce Choice', type: 'sauce' });
  if (arrays.shrimpMarinaraPastaTypes) registerOptionsToLookup(selectionLookup, arrays.shrimpMarinaraPastaTypes, { groupId: 'shrimp_marinara_pasta', groupTitle: 'Pasta Type', type: 'pasta_type' });
  if (arrays.shrimpMarinaraSubstituteSauce) registerOptionsToLookup(selectionLookup, arrays.shrimpMarinaraSubstituteSauce, { groupId: 'shrimp_marinara_sauce', groupTitle: 'Sauce Choice', type: 'sauce' });
  if (arrays.marinaraAppetizerSauceOptions) registerOptionsToLookup(selectionLookup, arrays.marinaraAppetizerSauceOptions, { groupId: 'marinara_appetizer_sauce', groupTitle: 'Sauce Choice', type: 'sauce' });
  
  // Salads
  if (arrays.saladToppingsOptions) registerOptionsToLookup(selectionLookup, arrays.saladToppingsOptions, { groupId: 'salad_toppings_opts', groupTitle: 'Toppings', type: 'topping' });
  if (arrays.antipastoSaladBases) registerOptionsToLookup(selectionLookup, arrays.antipastoSaladBases, { groupId: 'antipasto_base', groupTitle: 'Salad Base', type: 'salad_base' });
  if (arrays.antipastoSaladDressings) registerOptionsToLookup(selectionLookup, arrays.antipastoSaladDressings, { groupId: 'antipasto_dressing', groupTitle: 'Dressing', type: 'dressing' });
  if (arrays.antipastoSaladSpecialInstructions) registerOptionsToLookup(selectionLookup, arrays.antipastoSaladSpecialInstructions, { groupId: 'antipasto_instructions', groupTitle: 'Special Instructions', type: 'special_instruction' });
  if (arrays.caesarSaladSpecialInstructions) registerOptionsToLookup(selectionLookup, arrays.caesarSaladSpecialInstructions, { groupId: 'caesar_instructions', groupTitle: 'Special Instructions', type: 'special_instruction' });
  if (arrays.calamariSaladSpecialInstructions) registerOptionsToLookup(selectionLookup, arrays.calamariSaladSpecialInstructions, { groupId: 'calamari_salad_instructions', groupTitle: 'Special Instructions', type: 'special_instruction' });
  if (arrays.capreseSaladSpecialInstructions) registerOptionsToLookup(selectionLookup, arrays.capreseSaladSpecialInstructions, { groupId: 'caprese_instructions', groupTitle: 'Special Instructions', type: 'special_instruction' });
  if (arrays.farfallePastaSaladSpecialInstructions) registerOptionsToLookup(selectionLookup, arrays.farfallePastaSaladSpecialInstructions, { groupId: 'farfalle_instructions', groupTitle: 'Special Instructions', type: 'special_instruction' });
  if (arrays.gardenSaladSpecialInstructions) registerOptionsToLookup(selectionLookup, arrays.gardenSaladSpecialInstructions, { groupId: 'garden_instructions', groupTitle: 'Special Instructions', type: 'special_instruction' });
  if (arrays.italianChoppedSpecialInstructions) registerOptionsToLookup(selectionLookup, arrays.italianChoppedSpecialInstructions, { groupId: 'italian_chopped_instructions', groupTitle: 'Special Instructions', type: 'special_instruction' });
  if (arrays.roastedRedPeppersSaladSpecialInstructions) registerOptionsToLookup(selectionLookup, arrays.roastedRedPeppersSaladSpecialInstructions, { groupId: 'roasted_red_peppers_instructions', groupTitle: 'Special Instructions', type: 'special_instruction' });
  if (arrays.traditionalChefSaladSpecialInstructions) registerOptionsToLookup(selectionLookup, arrays.traditionalChefSaladSpecialInstructions, { groupId: 'traditional_chef_instructions', groupTitle: 'Special Instructions', type: 'special_instruction' });
  if (arrays.tunaSaladSpecialInstructions) registerOptionsToLookup(selectionLookup, arrays.tunaSaladSpecialInstructions, { groupId: 'tuna_instructions', groupTitle: 'Special Instructions', type: 'special_instruction' });
  if (arrays.threeCheeseSaladSpecialInstructions) registerOptionsToLookup(selectionLookup, arrays.threeCheeseSaladSpecialInstructions, { groupId: 'three_cheese_instructions', groupTitle: 'Special Instructions', type: 'special_instruction' });
  
  // Kids
  if (arrays.kidsPastaToppings) registerOptionsToLookup(selectionLookup, arrays.kidsPastaToppings, { groupId: 'kids_pasta_toppings', groupTitle: 'Toppings', type: 'topping' });
  if (arrays.kidsPastaSpecialInstructions) registerOptionsToLookup(selectionLookup, arrays.kidsPastaSpecialInstructions, { groupId: 'kids_pasta_instructions', groupTitle: 'Special Instructions', type: 'special_instruction' });
  if (arrays.kidsBakedExtraToppings) registerOptionsToLookup(selectionLookup, arrays.kidsBakedExtraToppings, { groupId: 'kids_baked_extra', groupTitle: 'Extra Toppings', type: 'extra_topping' });
  if (arrays.kidsBakedLiteToppings) registerOptionsToLookup(selectionLookup, arrays.kidsBakedLiteToppings, { groupId: 'kids_baked_lite', groupTitle: 'Lite Toppings', type: 'topping' });
  if (arrays.kidsBakedNoToppings) registerOptionsToLookup(selectionLookup, arrays.kidsBakedNoToppings, { groupId: 'kids_baked_no', groupTitle: 'No Toppings', type: 'no_topping' });
  if (arrays.kidsPastaMeatballToppings) registerOptionsToLookup(selectionLookup, arrays.kidsPastaMeatballToppings, { groupId: 'kids_pasta_meatball_toppings', groupTitle: 'Toppings', type: 'topping' });
  if (arrays.kidsPastaMeatballSpecialInstructions) registerOptionsToLookup(selectionLookup, arrays.kidsPastaMeatballSpecialInstructions, { groupId: 'kids_pasta_meatball_instructions', groupTitle: 'Special Instructions', type: 'special_instruction' });
  
  // Sides
  if (arrays.mashedPotatoesToppings) registerOptionsToLookup(selectionLookup, arrays.mashedPotatoesToppings, { groupId: 'mashed_potatoes_toppings', groupTitle: 'Toppings', type: 'topping' });
  if (arrays.meatballsSausageSauceToppings) registerOptionsToLookup(selectionLookup, arrays.meatballsSausageSauceToppings, { groupId: 'meatballs_sausage', groupTitle: 'Sauce Toppings', type: 'topping' });
  if (arrays.pastaFagioliSubstituteCracker) registerOptionsToLookup(selectionLookup, arrays.pastaFagioliSubstituteCracker, { groupId: 'pasta_fagioli_cracker', groupTitle: 'Substitute Cracker', type: 'topping' });
  if (arrays.pastaFagioliSubstituteOptions) registerOptionsToLookup(selectionLookup, arrays.pastaFagioliSubstituteOptions, { groupId: 'pasta_fagioli_substitute', groupTitle: 'Substitute Options', type: 'topping' });
  
  // Appetizers
  if (arrays.wingsSpecialInstructionsOptions) registerOptionsToLookup(selectionLookup, arrays.wingsSpecialInstructionsOptions, { groupId: 'wings_instructions', groupTitle: 'Special Instructions', type: 'special_instruction' });
  if (arrays.wingsExtraSauceOptions) registerOptionsToLookup(selectionLookup, arrays.wingsExtraSauceOptions, { groupId: 'wings_extra_sauce', groupTitle: 'Extra Sauce', type: 'extra_topping' });
  if (arrays.wingsExtraCheeseRanchOptions) registerOptionsToLookup(selectionLookup, arrays.wingsExtraCheeseRanchOptions, { groupId: 'wings_cheese_ranch', groupTitle: 'Extra Bleu Cheese/Ranch', type: 'extra_topping' });
  if (arrays.chickenTendersExtraSauceOptions) registerOptionsToLookup(selectionLookup, arrays.chickenTendersExtraSauceOptions, { groupId: 'chicken_tenders_sauce', groupTitle: 'Extra Sauce', type: 'extra_topping' });
  if (arrays.mozzarellaSticksExtraSauceOptions) registerOptionsToLookup(selectionLookup, arrays.mozzarellaSticksExtraSauceOptions, { groupId: 'mozzarella_sticks_sauce', groupTitle: 'Extra Sauce', type: 'extra_topping' });
  if (arrays.mozzarellaSticksSpecialInstructionsOptions) registerOptionsToLookup(selectionLookup, arrays.mozzarellaSticksSpecialInstructionsOptions, { groupId: 'mozzarella_sticks_instructions', groupTitle: 'Special Instructions', type: 'special_instruction' });
  if (arrays.aranciniSpecialInstructionsOptions) registerOptionsToLookup(selectionLookup, arrays.aranciniSpecialInstructionsOptions, { groupId: 'arancini_instructions', groupTitle: 'Special Instructions', type: 'special_instruction' });
  
  // Platters
  if (arrays.hoagiePlatterOptions) registerOptionsToLookup(selectionLookup, arrays.hoagiePlatterOptions, { groupId: 'hoagie_platter_options', groupTitle: 'Build Your Platter (Choose at least 4)', type: 'required_option' });
  if (arrays.hoagiePlatterCutOptions) registerOptionsToLookup(selectionLookup, arrays.hoagiePlatterCutOptions, { groupId: 'hoagie_platter_cut', groupTitle: 'Cut Options', type: 'required_option' });
  if (arrays.hoagiePlatterSideToppings) registerOptionsToLookup(selectionLookup, arrays.hoagiePlatterSideToppings, { groupId: 'hoagie_platter_side', groupTitle: 'Side Toppings', type: 'side' });
  if (arrays.wrapPlatterOptions) registerOptionsToLookup(selectionLookup, arrays.wrapPlatterOptions, { groupId: 'wrap_platter_options', groupTitle: 'Build Your Platter (Choose at least 4)', type: 'required_option' });
  if (arrays.wrapPlatterWrapTypes) registerOptionsToLookup(selectionLookup, arrays.wrapPlatterWrapTypes, { groupId: 'wrap_platter_types', groupTitle: 'Wrap Type', type: 'wrap_type' });
  if (arrays.wrapPlatterSideToppings) registerOptionsToLookup(selectionLookup, arrays.wrapPlatterSideToppings, { groupId: 'wrap_platter_side', groupTitle: 'Side Toppings', type: 'side' });
  if (arrays.hotSandwichPlatterOptions) registerOptionsToLookup(selectionLookup, arrays.hotSandwichPlatterOptions, { groupId: 'hot_sandwich_platter_options', groupTitle: 'Build Your Platter (Choose at least 4)', type: 'required_option' });
  if (arrays.hotSandwichPlatterCutOptions) registerOptionsToLookup(selectionLookup, arrays.hotSandwichPlatterCutOptions, { groupId: 'hot_sandwich_platter_cut', groupTitle: 'Cut Options', type: 'required_option' });
  if (arrays.hotSandwichPlatterSideToppings) registerOptionsToLookup(selectionLookup, arrays.hotSandwichPlatterSideToppings, { groupId: 'hot_sandwich_platter_side', groupTitle: 'Side Toppings', type: 'side' });
  
  // Desserts
  if (arrays.cannoliSpecialInstruction) registerOptionsToLookup(selectionLookup, arrays.cannoliSpecialInstruction, { groupId: 'cannoli_instructions', groupTitle: 'Special Instructions', type: 'special_instruction' });
  if (arrays.dessertTraySpecialInstruction) registerOptionsToLookup(selectionLookup, arrays.dessertTraySpecialInstruction, { groupId: 'dessert_tray_instructions', groupTitle: 'Special Instructions', type: 'special_instruction' });
};
