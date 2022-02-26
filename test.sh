docker-compose -f docker-compose.test.yml down -v && docker-compose -f docker-compose.test.yml --env-file ./.test.env run --rm nest yarn test:e2e 
