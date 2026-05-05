import { Module } from '@nestjs/common';
import { AppFeatureModule } from './modules/app/app.module';

@Module({
  imports: [AppFeatureModule],
})
export class AppModule {}
