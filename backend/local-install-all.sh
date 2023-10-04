echo "Install dining-service"
cd ./dining-service/ || exit 0
npm i

echo "Install gateway-service"
cd ../gateway/ || exit 0
npm i

echo "Install integration-tests"
cd ../integration-tests/ || exit 0
npm i

echo "Install kitchen-service"
cd ../kitchen-service/ || exit 0
npm i

echo "Install menu-service"
cd ../menu-service/ || exit 0
npm i
