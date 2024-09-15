import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';

export class WebApp2Stack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    // Configuración del DefaultStackSynthesizer
    const synthesizer = new cdk.DefaultStackSynthesizer({
      fileAssetsBucketName: 'pruebaluis1223',
      bucketPrefix: '',
      cloudFormationExecutionRole: 'arn:aws:iam::711397755029:role/LabRole',
      deployRoleArn: 'arn:aws:iam::711397755029:role/LabRole',
      fileAssetPublishingRoleArn: 'arn:aws:iam::711397755029:role/LabRole',
      imageAssetPublishingRoleArn: 'arn:aws:iam::711397755029:role/LabRole'
    });

    super(scope, id, { synthesizer, ...props });

    // Configuración de recursos AWS
    const vpc = ec2.Vpc.fromLookup(this, 'ExistingVpc', {
      vpcId: 'vpc-0bb0e5149780c8b1e'
    });

    const instanceRole = iam.Role.fromRoleArn(this, 'ExistingRole', 'arn:aws:iam::711397755029:role/LabRole');

    // Usar LookupMachineImage para encontrar la última imagen de Ubuntu
    const ubuntuAmi = ec2.MachineImage.lookup({
      name: 'ubuntu/images/hvm-ssd/ubuntu-focal-20.04-amd64-server-*',
      owners: ['099720109477']  // Canonical
    });

    const instance = new ec2.Instance(this, 'WebServer2', {
      instanceType: new ec2.InstanceType('t2.micro'),
      machineImage: ubuntuAmi,
      vpc,
      role: instanceRole
    });

    const userDataCommands = [
      'apt-get update -y',
      'apt-get install -y git',
      'git clone https://github.com/Luis23345432/websimple.git',
      'git clone https://github.com/Luis23345432/webplantilla.git',
      'cd websimple',
      'nohup python3 -m http.server 8001 &',
      'cd ../webplantilla',
      'nohup python3 -m http.server 8002 &'
    ];

    instance.addUserData(...userDataCommands);

    instance.connections.allowFromAnyIpv4(ec2.Port.tcp(8001), 'Allow HTTP traffic on port 8001');
    instance.connections.allowFromAnyIpv4(ec2.Port.tcp(8002), 'Allow HTTP traffic on port 8002');
  }
}
