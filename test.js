import test from 'tape';


test('should return exactly what is passed to it', (t) => {
  const val = 12345;
  t.equal(val, 12345);
  t.end();
});
