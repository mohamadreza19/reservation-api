import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';

import { join } from 'path';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: 'rainbowsixsige19@gmail.com',
          pass: 'qjby xnur olgr ubub',
        },
        tls: {
          rejectUnauthorized: true,
        },
      },
      defaults: {
        from: '"وقت قبلی" <noreply@example.com>',
      },
      template: {
        dir: join(__dirname, 'templates'), // Path to your email templates
        adapter: new EjsAdapter(), // Adapter for Handlebars
        options: {
          strict: false, // Enable strict mode to catch any errors in templates
        },
      },
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
