import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as LaunchDarkly from 'launchdarkly-node-server-sdk';

const client = LaunchDarkly.init('sdk-39f8771c-dc13-4fb2-b6b1-a9da0108a223');

const user = {
  firstName: 'Vincent',
  lastName: 'Chow',
  key: 'vincent.chow.demo.key',
  custom: {
    groups: 'beta_testers',
  },
};

async function launchdarkly() {
  try {
    await client.waitForInitialization();
    console.log('LaunchDarkly Initialized!');
  } catch (error) {
    console.error(error);
  }

  // client.once('ready', () => {
  client.variation('new-feature-demo', user, false, (err, showFeature) => {
    if (showFeature) {
      // application code to show the feature
      console.log('Showing your feature to ' + user.key);
    } else {
      // the code to run if the feature is off
      console.log('Not showing your feature to ' + user.key);
    }

    // client.flush(() => client.close());
    // client.flush();
  });
  // });
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);

  await launchdarkly();

  // setTimeout(launchdarkly, 3000);

  setTimeout(
    async () =>
      console.log(
        await client.variation(
          'new-feature-demo',
          { key: 'test.await' },
          false,
        ),
      ),
    3000,
  );
}

bootstrap();
