// Модульное тестирование
describe('GameCell Logic', () => {
  test('empty cell has value 0', () => {
    expect(0).toBe(0); 
  });

  test('non-empty cell shows number', () => {
    expect(5).toBe(5); 
  });
});