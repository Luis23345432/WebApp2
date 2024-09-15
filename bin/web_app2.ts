#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { WebApp2Stack } from '../lib/web_app2-stack';

const app = new cdk.App();

new WebApp2Stack(app, 'WebApp2Stack', {
    env: {
        account: '711397755029',  // Tu Account ID de AWS
        region: 'us-east-1'  // Región definida directamente
    }
});

app.synth();
