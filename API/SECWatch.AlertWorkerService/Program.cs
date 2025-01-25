using MassTransit;
using Quartz;
using SECWatch.AlertWorkerService.Consumers;
using SECWatch.AlertWorkerService.Jobs;
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
        
        cfg.ConfigureEndpoints(context);
    });
});

builder.Services.AddQuartz(q =>
{
    var jobKey = new JobKey("AlertDigestJob");

    q.AddJob<FilingAlertEmailDigestJob>(opts => opts.WithIdentity(jobKey));

    q.AddTrigger(opts => opts
        .ForJob(jobKey)
        .WithIdentity("AlertDigestJob-trigger")
        // Run at 10AM EST daily
        .WithCronSchedule("0 0 10 ? * MON-FRI *", x => 
            x.InTimeZone(TimeZoneInfo.FindSystemTimeZoneById("Eastern Standard Time")))
    );
});

builder.Services.AddQuartzHostedService(options =>
{
    options.WaitForJobsToComplete = true;
});

var host = builder.Build();
host.Run();