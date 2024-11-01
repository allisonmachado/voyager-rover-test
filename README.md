# Voyager Rover Test

### Running Locally

... TODO: add instructions

Note: If you need to install new dependencies or perform changes outside the `packages/**/src/**` (e.g.: change environment variables), you'll need to rebuild the images

```sh
docker compose down --rmi all
```

And then restart the services:

```sh
docker-compose up
```

### Sample Queries (MySQL)

##### list robots by longest distance traveled
```sql
select
  concat('R', rob.id) as robot
  , count(mov.id) distanceUnits
from robotic_rover rob
left join move_instruction mov on (
  mov.roboticRoverId = rob.id
  and mov.code = 'M'
)
where 
  rob.deletedAt is null
group by rob.id
order by distanceUnits desc
;
```

##### list plateaus by number of rovers
```sql
select
  pla.id as plateauId
  , pla.name as plateauName
  , count(rob.id) as roversCount
from plateau pla
left join robotic_rover rob on rob.plateauId = pla.id
where 
  pla.deletedAt is null
  and rob.deletedAt is null
group by pla.id
order by roversCount desc
;
```

##### list plateaus by total area
```sql
select
  pla.id as plateauId
  , pla.name as plateauName
  , pla.xWidth * pla.yHeight as totalArea
from plateau pla
where 
  pla.deletedAt is null
order by totalArea desc
;
```