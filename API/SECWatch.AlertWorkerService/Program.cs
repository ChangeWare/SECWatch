using AlertWorkerService.Consumers;
using AlertWorkerService.Jobs;
using MassTransit;
using Quartz;
using SECWatch.Application;
using SECWatch.Infrastructure;

var builder = Host.CreateApplicationBuilder(args);

// Add infrastructure (repositories, infrastructure services, etc.)
builder.Services.AddInfrastructure(builder.Configuration);

// Add application & domain services
builder.Services.AddApplicationServices(builder.Configuration);

builder.Services.AddMassTransit(x =>
{
    x.AddConsumer<FilingEventConsumer>();
    x.AddConsumer<FilingAlertNotificationConsumer>();
    
    x.UsingRabbitMq((context, cfg) =>
    {
        var host = builder.Configuration.GetValue<string>("RabbitMQ:Host");
        cfg.Host(host);
        
        cfg.UseJsonSerializer();
        
        cfg.ReceiveEndpoint("filing_events", e =>
        {
            e.ConfigureConsumer<FilingEventConsumer>(context);
            e.UseRawJsonDeserializer();
            e.UseMessageRetry(r => r.Intervals(
                TimeSpan.FromSeconds(1),
                TimeSpan.FromSeconds(5),
                TimeSpan.FromSeconds(15)
            ));
        });
    });
});

builder.Services.AddQuartz(q =>
{
    var jobKey = new JobKey("AlertDigestJob");

    q.AddJob<FilingAlertEmailDigestJob>(opts => opts.WithIdentity(jobKey));

    q.AddTrigger(opts => opts
        .ForJob(jobKey)
        .WithIdentity("AlertDigestJob-trigger")
        // Run at 9 AM & 2PM EST daily
        //.WithCronSchedule("0 0 14,19 * * ?")
        .WithSimpleSchedule(x => x
            .WithIntervalInMinutes(1)
            .RepeatForever()
        )
    );
});

var host = builder.Build();
host.Run();