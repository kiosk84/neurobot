# backup.ps1
param() # Ensure it's treated as a script

try {
    $timestamp = Get-Date -Format 'yyyyMMdd-HHmmss'
    # Get Desktop path reliably
    $desktopPath = [Environment]::GetFolderPath('Desktop')
    $archiveFileName = "project-backup-$timestamp.zip"
    $archivePath = Join-Path -Path $desktopPath -ChildPath $archiveFileName

    # Define exclusions based on common patterns from .gitignore
    # Add more if needed, these cover the basics from the provided .gitignore
    $exclusions = @(
        'node_modules',
        '.next',
        'out',
        'build',
        '.env*.local',
        '.vercel',
        '*.tsbuildinfo',
        'next-env.d.ts',
        'project-backup*.zip', # Exclude previous backups
        'backup.ps1'          # Exclude this script itself
    )

    Write-Host "Creating backup archive at: $archivePath"
    Write-Host "Excluding: $($exclusions -join ', ')"

    # Compress the current directory, letting Compress-Archive handle exclusions
    Compress-Archive -Path '.' -DestinationPath $archivePath -Force -Exclude $exclusions

    Write-Host "Backup created successfully: $archivePath"
} catch {
    Write-Error "Backup failed: $($_.Exception.Message)"
    exit 1 # Exit with an error code
}
