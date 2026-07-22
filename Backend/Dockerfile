# Usa la imagen oficial de SDK de .NET 8 para compilar
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copia el archivo .csproj y restaura las dependencias
COPY ["POSApp.API/POSApp.API.csproj", "POSApp.API/"]
RUN dotnet restore "POSApp.API/POSApp.API.csproj"

# Copia el resto del código y compila
COPY . .
WORKDIR "/src/POSApp.API"
RUN dotnet build "POSApp.API.csproj" -c Release -o /app/build

# Publica la aplicación
FROM build AS publish
RUN dotnet publish "POSApp.API.csproj" -c Release -o /app/publish

# Usa la imagen oficial de ASP.NET Core 8 en modo runtime para la imagen final
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Render usa el puerto definido en la variable de entorno PORT (o el 8080 por defecto)
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

ENTRYPOINT ["dotnet", "POSApp.API.dll"]
