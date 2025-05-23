const { createClient } = require('@supabase/supabase-js');
const { buffer } = require('micro');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

module.exports = async (req, res) => {
  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase.from('alumnos').select('*');
      if (error) {
        console.error('Supabase GET error:', error);
        return res.status(500).json({ error: error.message || error });
      }
      return res.status(200).json(data);
    }

    if (req.method === 'POST') {
      const buf = await buffer(req);
      let body;

      try {
        body = JSON.parse(buf.toString());
      } catch (parseError) {
        console.error('Error parsing body:', parseError);
        return res.status(400).json({ error: 'JSON inválido en el cuerpo de la petición' });
      }

      const { nombre, apellido } = body;

      if (!nombre || !apellido) {
        return res.status(400).json({ error: 'Faltan datos obligatorios: nombre y apellido' });
      }

      const { data, error } = await supabase.from('alumnos').insert([{ nombre, apellido }]);
      if (error) {
        console.error('Supabase POST error:', error);
        return res.status(500).json({ error: error.message || error });
      }

      return res.status(200).json(data[0]);
    }

    return res.status(405).json({ error: 'Método no permitido' });

  } catch (err) {
    console.error('Error no esperado en función API:', err);
    return res.status(500).json({ error: err.message || 'Error desconocido' });
  }
};
