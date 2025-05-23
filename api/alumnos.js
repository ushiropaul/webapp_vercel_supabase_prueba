const { createClient } = require('@supabase/supabase-js');
const { buffer } = require('micro'); // Necesario para parsear req.body en Vercel

// Inicializar Supabase con variables de entorno
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

module.exports = async (req, res) => {
  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase.from('alumnos').select('*');
      if (error) throw error;
      return res.status(200).json(data);
    }

    if (req.method === 'POST') {
      const buf = await buffer(req);
      const body = JSON.parse(buf.toString());

      const { nombre, apellido } = body;

      if (!nombre || !apellido) {
        return res.status(400).json({ error: 'Faltan datos obligatorios: nombre y apellido' });
      }

      const { data, error } = await supabase.from('alumnos').insert([{ nombre, apellido }]);
      if (error) throw error;

      return res.status(200).json(data[0]);
    }

    // Método no permitido
    return res.status(405).json({ error: 'Método no permitido' });

  } catch (err) {
    console.error('Error en la función API:', err);
    return res.status(500).json({ error: err.message || 'Error desconocido' });
  }
};
