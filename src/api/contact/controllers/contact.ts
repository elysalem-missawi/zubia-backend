import type { Context } from "koa";

export default {
  async send(ctx: Context) {
    const { name, email, subject, message } = ctx.request.body as {
      name?: string;
      email?: string;
      subject?: string;
      message?: string;
    };

    if (!name || !email || !subject || !message) {
      return ctx.badRequest("Todos los campos son obligatorios.");
    }

    try {
      await strapi.plugin("email").service("email").send({
        to: process.env.EMAIL_TO,
        replyTo: email,
        subject: `Contacto web: ${subject}`,
        text: `
Nombre: ${name}
Email: ${email}

Mensaje:

${message}
        `,
        html: `
          <h2>Nuevo mensaje desde la web</h2>

          <p><strong>Nombre:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Asunto:</strong> ${subject}</p>

          <hr />

          <p><strong>Mensaje:</strong></p>
          <p>${message.replace(/\n/g, "<br />")}</p>
        `,
      });

      return ctx.send({
        success: true,
        message: "Mensaje enviado correctamente.",
      });
    } catch (error) {
      console.error("CONTACT EMAIL ERROR:", error);

      return ctx.internalServerError(
        "No se pudo enviar el mensaje."
      );
    }
  },
};