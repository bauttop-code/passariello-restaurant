
import { buildCartDisplayLines, CartItem } from './cart-display';

// Mock console to avoid noise during tests
global.console = {
  ...console,
  group: jest.fn(),
  groupEnd: jest.fn(),
  log: jest.fn(),
} as any;

describe('Wings Order Logic', () => {
  it('follows the strict pipeline for wings display', () => {
    // Input derived from user logs
    const item: CartItem = {
      id: 'wings-test-strict',
      name: '10 Wings',
      quantity: 1,
      category: 'wings',
      selections: [
        { id: '1', label: '2oz Bleu Cheese', type: 'included', groupId: 'wings_included', groupTitle: 'Included' },
        { id: '2', label: 'American', type: 'cheese', groupId: 'cheese', groupTitle: 'Cheese' }, // Garbage
        { id: '3', label: 'Mild Sauce (4oz)', type: 'sauce', groupId: 'wings_extra_sauce', groupTitle: 'Extra Sauce' },
        { id: '4', label: 'Extra Ranch Sauce (4oz)', type: 'sauce', groupId: 'wings_extra_sauce', groupTitle: 'Extra Sauce' },
        { id: '5', label: 'Bleu Cheese (4oz)', type: 'sauce', groupId: 'wings_extra_sauce', groupTitle: 'Extra Sauce' }, // Should be Dipping? User says "Dedupe replacing 2oz Bleu Cheese with Extra Bleu Cheese (4oz)" and it goes to end
        { id: '6', label: 'Sauce Mixed In', type: 'instruction', groupId: 'wings_instruction', groupTitle: 'Instructions' },
        { id: '7', label: '10 pcs', type: 'quantity', groupId: 'quantity', groupTitle: 'Quantity' }, // Garbage
        { id: '8', label: 'BBQ Sauce', type: 'sauce', groupId: 'wings_sauce', groupTitle: 'Choose Your Sauce' },
        { id: '9', label: 'Extra Ranch Sauce', type: 'sauce', groupId: 'wings_extra_sauce', groupTitle: 'Extra Sauce' }, // Should dedupe with (4oz)
        { id: '10', label: 'Bleu Cheese', type: 'sauce', groupId: 'wings_dipping', groupTitle: 'Dipping' } // Dedupe
      ]
    };

    const lines = buildCartDisplayLines(item);
    
    // Expected Output:
    // ['BBQ Sauce', 'Sauce Mixed In', 'Mild Sauce (4oz)', 'Extra Ranch Sauce (4oz)', 'Extra Bleu Cheese (4oz)']
    // Note: The logic will prepend "1 " because item quantity is 1.
    // However, the test should verify the order strictly.
    
    expect(lines).toEqual([
      '1 BBQ Sauce',
      '1 Sauce Mixed In',
      '1 Mild Sauce (4oz)',
      '1 Extra Ranch Sauce (4oz)',
      '1 Extra Bleu Cheese (4oz)'
    ]);
  });
});
